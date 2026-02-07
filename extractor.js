javascript:(function() {
    'use strict';
    // الرابط الخاص بك بعد التعديل (تأكد من تغييره لرابط صفحتك على GitHub)
    const VIEWER_URL = "https://momonhde2119.github.io/schedule/";
    const TEMP_STORAGE_KEY = 'temp_spu_schedule_data';

    function extractSPUSchedule() {
        const coursesData = [];
        // البحث عن الحاوية الرئيسية للجدول بناءً على الكود الذي أرسلته
        const elements = document.querySelectorAll('div.p-4.flex.flex-col.w-full span');
        
        // المتغيرات لجمع البيانات المؤقتة
        let currentCourse = {
            name: "مقرر دراسي", // نظام SPU قد يحتاج تعديل لجلب الاسم من مكان آخر بالصفحة
            code: "SPU",
            section: "1",
            schedule: []
        };

        elements.forEach(el => {
            const text = el.innerText.trim();
            // التحقق من وجود وقت (مثلاً 11:20AM)
            if (text.includes('AM') || text.includes('PM')) {
                const dayMatch = text.match(/(السبت|الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة)/);
                const timeMatch = text.match(/\d{2}:\d{2}(?:AM|PM)-\d{2}:\d{2}(?:AM|PM)/);
                
                if (dayMatch && timeMatch) {
                    coursesData.push({
                        name: "محاضرة", 
                        code: "SPU",
                        section: "1",
                        time: `${dayMatch[0]}: ${timeMatch[0]}`,
                        location: "قاعة دراسية",
                        instructor: "غير محدد"
                    });
                }
            }
        });
        return coursesData;
    }

    setTimeout(() => {
        const courses = extractSPUSchedule();
        
        if (courses.length === 0) {
            alert("لم يتم العثور على محاضرات. تأكد من فتح صفحة الجدول الدراسي.");
            return;
        }

        sessionStorage.setItem(TEMP_STORAGE_KEY, JSON.stringify(courses));
        const viewerWindow = window.open(VIEWER_URL, 'SPU_Schedule_Viewer');

        if (!viewerWindow) {
            alert("يرجى السماح بالنوافذ المنبثقة (Pop-ups) للموقع.");
            return;
        }

        const messageHandler = (event) => {
            if (event.data === 'request_schedule_data') {
                const storedData = sessionStorage.getItem(TEMP_STORAGE_KEY);
                if (storedData) {
                    viewerWindow.postMessage({ 
                        type: 'universityCoursesData', 
                        data: JSON.parse(storedData) 
                    }, new URL(VIEWER_URL).origin);
                    sessionStorage.removeItem(TEMP_STORAGE_KEY);
                    window.removeEventListener('message', messageHandler);
                }
            }
        };
        window.addEventListener('message', messageHandler, false);
    }, 1000);
})();

