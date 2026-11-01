
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

// Switch to login
loginTab.addEventListener("click", () => {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");

    loginTab.classList.add("active");
    signupTab.classList.remove("active");
});

// Switch to signup
signupTab.addEventListener("click", () => {
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    signupTab.classList.add("active");
    loginTab.classList.remove("active");
});

// Demo account
document.getElementById("demoBtn").addEventListener("click", () => {
    window.location.href = "./dashboard.html";
});

// Temporary login demonstration
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    alert("Frontend ready! Real login will be connected with PHP.");
});

// Temporary signup demonstration
signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    alert("Signup frontend ready! PHP registration will be added later.");
});
