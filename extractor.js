javascript:(function() {
    'use strict';
    // ضع رابطك هنا بعد تفعيل الـ Pages
    const VIEWER_URL = "https://momonhde2119.github.io/schedule/";
    const TEMP_STORAGE_KEY = 'temp_spu_schedule_data';

    function extractSPUSchedule() {
        const coursesData = [];
        // هذا السطر يبحث عن الأيام والأوقات في نظام جامعتك SPU
        const elements = document.querySelectorAll('div.p-4.flex.flex-col.w-full span');
        
        elements.forEach(el => {
            const text = el.innerText.trim();
            if (text.includes('AM') || text.includes('PM')) {
                // استخراج اسم المادة من العنصر الأب أو العناوين القريبة
                const courseName = document.querySelector('h3') ? document.querySelector('h3').innerText : "مقرر دراسي";
                coursesData.push({
                    name: courseName,
                    code: "SPU",
                    time: text,
                    location: "قاعة دراسية",
                    instructor: "هيئة تدريسية"
                });
            }
        });
        return coursesData;
    }

    const courses = extractSPUSchedule();
    if (courses.length > 0) {
        sessionStorage.setItem(TEMP_STORAGE_KEY, JSON.stringify(courses));
        window.open(VIEWER_URL, 'SPU_Schedule_Viewer');
    } else {
        alert("تأكد من فتح صفحة الجدول الدراسي أولاً");
    }
})();