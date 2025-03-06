console.log("main.js success");

flashMessages = document.querySelector('#flashMessages');

document.addEventListener("DOMContentLoaded", clearFlashMessages());
document.addEventListener("load", clearFlashMessages());

// clearFlashMessages
function clearFlashMessages() {
    setTimeout(function() { flashMessages.innerHTML = null; }, 3000);
}