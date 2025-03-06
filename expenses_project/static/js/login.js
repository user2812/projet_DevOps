// passowrd toggle button

const usernameField = document.querySelector("#usernameField");

const passwordToggle = document.querySelector('#passwordToggle');
const passwordField = document.querySelector('#passwordField');

const flashMessages = document.querySelector('#flashMessages');

document.addEventListener("DOMContentLoaded", clearFlashMessages());

passwordToggle.addEventListener("click", e => {
    if (passwordField.getAttribute("type") == "password") {
        passwordToggle.textContent = "HIDE";
        passwordField.setAttribute("type", "text");
    } else {
        passwordToggle.textContent = "SHOW";
        passwordField.setAttribute("type", "password");
    }
})

// clearFlashMessages
function clearFlashMessages() {
    setTimeout(function() { flashMessages.innerHTML = null; }, 5000);
}

