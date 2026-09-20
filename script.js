/* =========================================================
   NEXORA STUDY OS
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   DATA
========================================================= */

let user = JSON.parse(
    localStorage.getItem("nexoraUser")
) || null;


let subjects = JSON.parse(
    localStorage.getItem("nexoraSubjects")
) || [];


let tasks = JSON.parse(
    localStorage.getItem("nexoraTasks")
) || [];


let reminders = JSON.parse(
    localStorage.getItem("nexoraReminders")
) || [];


let studyData = JSON.parse(
    localStorage.getItem("nexoraStudy")
) || {
    totalMinutes: 0,
    sessions: 0,
    weekly: [0, 0, 0, 0, 0, 0, 0]
};


let settings = JSON.parse(
    localStorage.getItem("nexoraSettings")
) || {
    dailyGoal: 120
};


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    if (user) {

        showApp();

    } else {

        document
            .getElementById("authScreen")
            .classList.remove("hidden");

    }

    updateDate();

    renderAll();

});


/* =========================================================
   STORAGE
========================================================= */

function saveData() {

    localStorage.setItem(
        "nexoraUser",
        JSON.stringify(user)
    );

    localStorage.setItem(
        "nexoraSubjects",
        JSON.stringify(subjects)
    );

    localStorage.setItem(
        "nexoraTasks",
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        "nexoraReminders",
        JSON.stringify(reminders)
    );

    localStorage.setItem(
        "nexoraStudy",
        JSON.stringify(studyData)
    );

    localStorage.setItem(
        "nexoraSettings",
        JSON.stringify(settings)
    );
}


/* =========================================================
   AUTH
========================================================= */

function showAuth(type) {

    const loginForm =
        document.getElementById("loginForm");

    const registerForm =
        document.getElementById("registerForm");

    const tabs =
        document.querySelectorAll(".auth-tab");


    tabs.forEach(tab => {
        tab.classList.remove("active");
    });


    if (type === "login") {

        loginForm.classList.remove("hidden");

        registerForm.classList.add("hidden");

        tabs[0].classList.add("active");

    } else {

        loginForm.classList.add("hidden");

        registerForm.classList.remove("hidden");

        tabs[1].classList.add("active");

    }

}


function register(event) {

    event.preventDefault();


    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;


    user = {

        name: name,

        email: email,

        password: password

    };


    saveData();

    showApp();

    showToast(
        "حساب شما با موفقیت ساخته شد."
    );

}


function login(event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    if (
        !user ||
        user.email !== email ||
        user.password !== password
    ) {

        showToast(
            "ایمیل یا رمز عبور اشتباه است."
        );

        return;

    }


    showApp();

    showToast(
        "خوش آمدی به NEXORA."
    );

}


function logout() {

    document
        .getElementById("app")
        .classList.add("hidden");


    document
        .getElementById("authScreen")
        .classList.remove("hidden");

}


/* =========================================================
   SHOW APP
========================================================= */

function showApp() {

    document
        .getElementById("authScreen")
        .classList.add("hidden");


    document
        .getElementById("app")
        .classList.remove("hidden");


    updateUserUI();

    renderAll();

}


/* =========================================================
   USER UI
========================================================= */

function updateUserUI() {

    if (!user) return;


    const name =
        user.name || "User";


    document
        .getElementById("welcomeName")
        .textContent = name;


    document
        .getElementById("sidebarName")
        .textContent = name;


    const firstLetter =
        name.charAt(0).toUpperCase();


    document
        .getElementById("avatar")
        .textContent = firstLetter;


    document
        .getElementById("topAvatar")
        .textContent = firstLetter;


    document
        .getElementById("settingsName")
        .value = name;


    document
        .getElementById("dailyGoal")
        .value = settings.dailyGoal;

}


/* =========================================================
   DATE
========================================================= */

function updateDate() {

    const date = new Date();


    const days = [

        "یکشنبه",
        "دوشنبه",
        "سه‌شنبه",
        "چهارشنبه",
        "پنجشنبه",
        "جمعه",
        "شنبه"

    ];


    const months = [

        "ژانویه",
        "فوریه",
        "مارس",
        "آوریل",
        "مه",
        "ژوئن",
        "ژوئیه",
        "اوت",
        "سپتامبر",
        "اکتبر",
        "نوامبر",
        "دسامبر"

    ];


    const text =
        `${days[date.getDay()]} · ${date.getDate()} ${months[date.getMonth()]}`;


    document
        .getElementById("currentDate")
        .textContent = text;

}


/* =========================================================
   NAVIGATION
========================================================= */

function showPage(page, button = null) {

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(item => {
        item.classList.remove("active-page");
    });


    const selected =
        document.getElementById(page + "Page");


    if (selected) {

        selected.classList.add("active-page");

    }


    const navItems =
        document.querySelectorAll(".nav-item");


    navItems.forEach(item => {
        item.classList.remove("active");
    });


    if (button) {

        button.classList.add("active");

    } else {

        navItems.forEach(item => {

            const onclick =
                item.getAttribute("onclick") || "";


            if (
                onclick.includes(
                    `showPage('${page}'`
                )
            ) {

                item.classList.add("active");

            }

        });

    }


    const titles = {

        dashboard: "داشبورد",

        subjects: "درس‌ها",

        planner: "برنامه‌ریزی",

        pomodoro: "پومودورو",

        progress: "پیشرفت",

        reminders: "یادآوری‌ها",

        settings: "تنظیمات"

    };


    document
        .getElementById("pageTitle")
        .textContent =
        titles[page] || "NEXORA";


    closeSidebar();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function toggleSidebar() {

    document
        .querySelector(".sidebar")
        .classList.toggle("open");

}


function closeSidebar() {

    document
        .querySelector(".sidebar")
        .classList.remove("open");

}


/* =========================================================
   SUBJECTS
========================================================= */

function addSubject(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("subjectName")
            .value
            .trim();


    const progress =
        Number(
            document
                .getElementById("subjectProgress")
                .value
        );


    subjects.push({

        id: Date.now(),

        name: name,

        progress: Math.min(
            100,
            Math.max(0, progress)
        )

    });


    saveData();

    closeModal("subjectModal");

    event.target.reset();

    renderAll();

    showToast(
        "درس جدید اضافه شد."
    );

}


function deleteSubject(id) {

    subjects =
        subjects.filter(
            subject => subject.id !== id
        );


    saveData();

    renderAll();

    showToast(
        "درس حذف شد."
    );

}


/* =========================================================
   RENDER SUBJECTS
========================================================= */

function renderSubjects() {

    const container =
        document.getElementById("subjectsGrid");


    if (!subjects.length) {

        container.innerHTML = `
            <div class="empty-state">
                هنوز هیچ درسی اضافه نکردی.
                <br>
                اولین درس خودت را ایجاد کن.
            </div>
        `;

        return;

    }


    container.innerHTML =
        subjects.map(subject => `

            <div class="subject-card">

                <div class="subject-top">

                    <div class="subject-icon">
                        ◈
                    </div>

                    <button
                        class="subject-delete"
                        onclick="deleteSubject(${subject.id})">

                        ×

                    </button>

                </div>


                <h3>
                    ${escapeHTML(subject.name)}
                </h3>

                <p>
                    Study Module
                </p>


                <div class="subject-progress">

                    <div class="progress-info">

                        <span>
                            Progress
                        </span>

                        <span>
                            ${subject.progress}%
                        </span>

                    </div>

                    <div class="progress-track">

                        <div
                            class="progress-fill"
                            style="width:${subject.progress}%">

                        </div>

                    </div>

                </div>

            </div>

        `).join("");

}


/* =========================================================
   TASKS
========================================================= */

function addTask(event) {

    event.preventDefault();


    const title =
        document
            .getElementById("taskTitle")
            .value
            .trim();


    const time =
        document
            .getElementById("taskTime")
            .value;


    const duration =
        Number(
            document
                .getElementById("taskDuration")
                .value
        );


    tasks.push({

        id: Date.now(),

        title: title,

        time: time,

        duration: duration,

        completed: false,

        date:
            new Date()
                .toISOString()
                .slice(0, 10)

    });


    tasks.sort(
        (a, b) =>
            a.time.localeCompare(b.time)
    );


    saveData();

    closeModal("taskModal");

    event.target.reset();

    renderAll();

    showToast(
        "برنامه جدید ثبت شد."
    );

}


function toggleTask(id) {

    const task =
        tasks.find(
            item => item.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    if (task.completed) {

        studyData.sessions++;

    }


    saveData();

    renderAll();

}


function deleteTask(id) {

    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveData();

    renderAll();

}


/* =========================================================
   PLANNER
========================================================= */

function changePlanner(type, button) {

    document
        .querySelectorAll(".planner-tab")
        .forEach(item => {
            item.classList.remove("active");
        });


    button.classList.add("active");


    renderPlanner(type);

}


function renderPlanner(type = "today") {

    const container =
        document.getElementById("plannerContent");


    let data = [...tasks];


    if (type === "today") {

        const today =
            new Date()
                .toISOString()
                .slice(0, 10);


        data =
            tasks.filter(
                task => task.date === today
            );

    }


    if (!data.length) {

        container.innerHTML = `

            <div class="panel">

                <div class="empty-state">

                    هیچ برنامه‌ای برای این بخش ثبت نشده.

                </div>

            </div>

        `;

        return;

    }


    container.innerHTML =
        data.map(task => `

            <div
                class="task-card
                ${task.completed ? "completed" : ""}">

                <div class="task-time">

                    ${task.time}

                </div>


                <div>

                    <h3>
                        ${escapeHTML(task.title)}
                    </h3>

                    <p>
                        ${task.duration} دقیقه
                    </p>

                </div>


                <div class="task-actions">

                    <button
                        onclick="toggleTask(${task.id})">

                        ${task.completed ? "↶" : "✓"}

                    </button>


                    <button
                        onclick="deleteTask(${task.id})">

                        ×

                    </button>

                </div>

            </div>

        `).join("");

}


/* =========================================================
   TODAY DASHBOARD
========================================================= */

function renderToday() {

    const container =
        document.getElementById("todayList");


    if (!tasks.length) {

        container.innerHTML = `

            <div class="empty-state">

                هنوز برنامه‌ای ثبت نشده.

            </div>

        `;

        return;

    }


    const data =
        tasks.slice(0, 5);


    container.innerHTML =
        data.map(task => `

            <div class="today-item">

                <div class="today-time">
                    ${task.time}
                </div>


                <div>

                    <strong>
                        ${escapeHTML(task.title)}
                    </strong>

                    <span>
                        ${task.duration} دقیقه
                    </span>

                </div>


                <button
                    class="done-check
                    ${task.completed ? "done" : ""}"
                    onclick="toggleTask(${task.id})">

                    ${task.completed ? "✓" : ""}

                </button>

            </div>

        `).join("");

}


/* =========================================================
   DASHBOARD PROGRESS
========================================================= */

function renderDashboardProgress() {

    const container =
        document.getElementById(
            "dashboardProgress"
        );


    if (!subjects.length) {

        container.innerHTML = `

            <div class="empty-state">

                برای نمایش پیشرفت، درس اضافه کن.

            </div>

        `;

        return;

    }


    container.innerHTML =
        subjects.slice(0, 4).map(subject => `

            <div class="progress-row">

                <div class="progress-info">

                    <span>
                        ${escapeHTML(subject.name)}
                    </span>

                    <span>
                        ${subject.progress}%
                    </span>

                </div>


                <div class="progress-track">

                    <div
                        class="progress-fill"
                        style="width:${subject.progress}%">

                    </div>

                </div>

            </div>

        `).join("");

}


/* =========================================================
   PROGRESS
========================================================= */

function calculateProgress() {

    if (!subjects.length) {
        return 0;
    }


    const total =
        subjects.reduce(
            (sum, subject) =>
                sum + Number(subject.progress),
            0
        );


    return Math.round(
        total / subjects.length
    );

}


function renderProgress() {

    const progress =
        calculateProgress();


    document
        .getElementById("overallProgress")
        .textContent =
        progress + "%";


    document
        .getElementById("bigProgress")
        .textContent =
        progress + "%";


    document
        .getElementById("bigProgressBar")
        .style.width =
        progress + "%";


    const hours =
        Math.floor(
            studyData.totalMinutes / 60
        );


    const minutes =
        studyData.totalMinutes % 60;


    document
        .getElementById("totalStudy")
        .textContent =
        `${hours}h ${minutes}m`;


    const container =
        document.getElementById(
            "progressSubjects"
        );


    if (!subjects.length) {

        container.innerHTML = "";

        return;

    }


    container.innerHTML =
        subjects.map(subject => `

            <div class="panel">

                <div class="progress-info">

                    <span>
                        ${escapeHTML(subject.name)}
                    </span>

                    <span>
                        ${subject.progress}%
                    </span>

                </div>


                <div
                    class="progress-track"
                    style="margin-top:12px">

                    <div
                        class="progress-fill"
                        style="width:${subject.progress}%">

                    </div>

                </div>

            </div>

        `).join("");

}


/* =========================================================
   CHART
========================================================= */

function renderChart() {

    const chart =
        document.getElementById(
            "studyChart"
        );


    const days = [

        "ش",
        "ی",
        "د",
        "س",
        "چ",
        "پ",
        "ج"

    ];


    const max =
        Math.max(
            ...studyData.weekly,
            60
        );


    chart.innerHTML =
        studyData.weekly.map(
            (value, index) => {

                const height =
                    Math.max(
                        4,
                        (value / max) * 100
                    );


                return `

                    <div class="chart-column">

                        <div
                            class="chart-bar"
                            style="height:${height}%"
                            title="${value} دقیقه">

                        </div>

                        <span>
                            ${days[index]}
                        </span>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================================
   STUDY TIME
========================================================= */

function addStudyMinutes(minutes) {

    minutes =
        Number(minutes);


    if (
        !minutes ||
        minutes <= 0
    ) {

        return;

    }


    studyData.totalMinutes += minutes;

    studyData.sessions++;


    const day =
        new Date().getDay();


    studyData.weekly[day] += minutes;


    saveData();

    renderAll();

}


/* =========================================================
   POMODORO
========================================================= */

let timerMinutes = 25;

let timerSeconds = 0;

let timerInterval = null;

let timerRunning = false;


function updateTimerUI() {

    const minutes =
        String(timerMinutes)
            .padStart(2, "0");


    const seconds =
        String(timerSeconds)
            .padStart(2, "0");


    const time =
        `${minutes}:${seconds}`;


    document
        .getElementById("mainTimer")
        .textContent = time;


    document
        .getElementById("miniTimer")
        .textContent = time;

}


function setTimerMode(minutes, button) {

    stopTimer();


    timerMinutes = minutes;

    timerSeconds = 0;


    document
        .querySelectorAll(".mode")
        .forEach(item => {
            item.classList.remove("active");
        });


    button.classList.add("active");


    updateTimerUI();

}


function toggleTimer() {

    if (timerRunning) {

        stopTimer();

    } else {

        startTimer();

    }

}


function startTimer() {

    timerRunning = true;


    document
        .getElementById("timerStart")
        .textContent =
        "PAUSE";


    timerInterval =
        setInterval(
            tickTimer,
            1000
        );

}


function stopTimer() {

    timerRunning = false;


    clearInterval(
        timerInterval
    );


    document
        .getElementById("timerStart")
        .textContent =
        "START";

}


function tickTimer() {

    if (
        timerMinutes === 0 &&
        timerSeconds === 0
    ) {

        finishTimer();

        return;

    }


    if (timerSeconds === 0) {

        timerMinutes--;

        timerSeconds = 59;

    } else {

        timerSeconds--;

    }


    updateTimerUI();

}


function finishTimer() {

    stopTimer();


    studyData.sessions++;


    studyData.totalMinutes += 25;


    const day =
        new Date().getDay();


    studyData.weekly[day] += 25;


    saveData();

    renderAll();


    showToast(
        "جلسه تمرکز تمام شد! +25 دقیقه مطالعه"
    );


    timerMinutes = 25;

    timerSeconds = 0;

    updateTimerUI();

}


function resetTimer() {

    stopTimer();


    timerMinutes = 25;

    timerSeconds = 0;


    document
        .querySelectorAll(".mode")
        .forEach(
            item =>
                item.classList.remove("active")
        );


    document
        .querySelector(".mode")
        .classList.add("active");


    updateTimerUI();

}


/* =========================================================
   REMINDERS
========================================================= */

function addReminder(event) {

    event.preventDefault();


    const title =
        document
            .getElementById("reminderTitle")
            .value
            .trim();


    const time =
        document
            .getElementById("reminderTime")
            .value;


    reminders.push({

        id: Date.now(),

        title: title,

        time: time

    });


    reminders.sort(
        (a, b) =>
            a.time.localeCompare(b.time)
    );


    saveData();

    closeModal("reminderModal");

    event.target.reset();

    renderAll();

    showToast(
        "یادآوری ایجاد شد."
    );

}


function deleteReminder(id) {

    reminders =
        reminders.filter(
            reminder =>
                reminder.id !== id
        );


    saveData();

    renderAll();

}


function renderReminders() {

    const container =
        document.getElementById(
            "remindersList"
        );


    if (!reminders.length) {

        container.innerHTML = `

            <div class="panel">

                <div class="empty-state">

                    هنوز یادآوری‌ای نداری.

                </div>

            </div>

        `;

        return;

    }


    container.innerHTML =
        reminders.map(reminder => `

            <div class="reminder-card">

                <div class="reminder-card-left">

                    <div class="reminder-icon">
                        🔔
                    </div>

                    <div>

                        <h3>
                            ${escapeHTML(reminder.title)}
                        </h3>

                        <span>
                            امروز · ${reminder.time}
                        </span>

                    </div>

                </div>


                <button
                    class="reminder-delete"
                    onclick="deleteReminder(${reminder.id})">

                    ×

                </button>

            </div>

        `).join("");

}


/* =========================================================
   SETTINGS
========================================================= */

function saveSettings() {

    const name =
        document
            .getElementById("settingsName")
            .value
            .trim();


    const goal =
        Number(
            document
                .getElementById("dailyGoal")
                .value
        );


    if (user && name) {

        user.name = name;

    }


    if (goal > 0) {

        settings.dailyGoal = goal;

    }


    saveData();

    updateUserUI();

    showToast(
        "تنظیمات ذخیره شد."
    );

}


/* =========================================================
   MODALS
========================================================= */

function openModal(id) {

    document
        .getElementById(id)
        .classList.add("show");

}


function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("show");

}


document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains("modal")
        ) {

            event.target.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================================
   TOAST
========================================================= */

let toastTimeout;


function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderAll() {

    updateStats();

    renderSubjects();

    renderPlanner();

    renderToday();

    renderDashboardProgress();

    renderProgress();

    renderChart();

    renderReminders();

    updateUserUI();

}


/* =========================================================
   STATS
========================================================= */

function updateStats() {

    const hours =
        Math.floor(
            studyData.totalMinutes / 60
        );


    const minutes =
        studyData.totalMinutes % 60;


    document
        .getElementById("todayStudy")
        .textContent =
        `${hours}:${String(minutes).padStart(2, "0")}`;


    document
        .getElementById("completedSessions")
        .textContent =
        studyData.sessions;


    document
        .getElementById("subjectCount")
        .textContent =
        subjects.length;


    document
        .getElementById("pomodoroSessions")
        .textContent =
        studyData.sessions;

}


/* =========================================================
   HTML SECURITY
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================================
   REMINDER CHECK
========================================================= */

setInterval(
    function () {

        if (!reminders.length) return;


        const now =
            new Date();


        const currentTime =
            now
                .toTimeString()
                .slice(0, 5);


        reminders.forEach(
            reminder => {

                if (
                    reminder.time ===
                    currentTime
                ) {

                    showToast(
                        `🔔 ${reminder.title}`
                    );

                }

            }
        );

    },
    60000
);


/* =========================================================
   KEYBOARD SHORTCUT
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.code === "Space" &&
            document
                .getElementById("pomodoroPage")
                .classList
                .contains("active-page")
        ) {

            event.preventDefault();

            toggleTimer();

        }

    }
);