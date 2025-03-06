const genericThrottle = ` <div class="spinner-border spinner-border-sm text-warning" role="status">
<span class="visually-hidden">Loading...</span>
</div>
<span class="text-warning">loading</span>
`

const usernameField = document.querySelector("#usernameField");
const usernameFeedback = document.querySelector('#validationServerUsernameFeedback');
let validUsername = false;

const emailField = document.querySelector("#emailField");
const emailFeedback = document.querySelector('#validationServerEmailFeedback');
let validEmail = false;

const passwordToggle = document.querySelector("#passwordToggle");

const passwordField = document.querySelector("#passwordField");
const passwordFeedback = document.querySelector("#validationServerPasswordFeedback");
let validPassword = false;

const registerButton = document.querySelector("#register-account-btn");

const flashMessages = document.querySelector('#flashMessages');

// process client side validation on load
emailField.addEventListener("pageshow", validateEmail(null));
usernameField.addEventListener("pageshow", validateUsername(null));
passwordField.addEventListener("pageshow", validatePassword(null));

// process client side validation on key up
usernameField.addEventListener("keyup", e => validateUsername(e));
emailField.addEventListener("keyup", e => validateEmail(e));
passwordField.addEventListener("keyup", e => validatePassword(e));

// clear server side flash messages
document.addEventListener("DOMContentLoaded", clearFlashMessages());

// passowrd toggle button
passwordToggle.addEventListener("click", e => {
    if (passwordField.getAttribute("type") == "password") {
        passwordToggle.textContent = "HIDE";
        passwordField.setAttribute("type", "text");
    } else {
        passwordToggle.textContent = "SHOW";
        passwordField.setAttribute("type", "password");
    }
})

// register button
function toggleRegisterButton() {
    if (validEmail && validUsername && validPassword) {
        registerButton.disabled = false;
    } else {
        registerButton.disabled = true;
    }
}

// clearFlashMessages
function clearFlashMessages() {
    setTimeout(function() { flashMessages.innerHTML = null; }, 5000);
}


function validatePassword(e) {
    // password is invalid on key change
    validPassword = false;
    let passwordValue;
    if (e != null) {
        passwordValue = e.target.value;
    } else {
        passwordValue = document.querySelector("#passwordField").value;
    }
    

    if (passwordValue.length > 0) {
        // loading when throttle
        passwordFeedback.innerHTML = genericThrottle;

        fetch("/authentication/validate-password", {
            method : 'POST',
            body: JSON.stringify({
                password: passwordValue
            })
        })
        .then(response => response.json())
        .then(result => {
            // console.log(result);

            // invalid password
            if (result.password_error) {
                passwordField.classList.remove("is-valid");
                passwordField.classList.add("is-invalid");

                passwordFeedback.classList.remove("valid-feedback");
                passwordFeedback.classList.add("invalid-feedback");

                passwordFeedback.innerHTML = `<p> ${result.password_error} </p>`;

            }

            if (result.password_valid) {
                passwordField.classList.remove("is-invalid");
                passwordField.classList.add("is-valid");

                passwordFeedback.classList.remove("invalid-feedback");
                passwordFeedback.classList.add("valid-feedback");

                passwordFeedback.innerHTML = `<p> ${result.password_valid} </p>`;
                
                validPassword = true;
            }

            toggleRegisterButton();

        })
    } else {
        passwordField.classList.remove("is-valid");
        passwordField.classList.remove("is-invalid");

        passwordFeedback.classList.remove("invalid-feedback");
        passwordFeedback.classList.remove("valid-feedback");
        
        passwordFeedback.innerHTML = null;

        registerButton.disabled = true;
    }
}


function validateEmail(e) {
    // email is invalid prior ajax validation on key change
    validEmail = false;
    let emailValue;
    if (e != null) {
        emailValue = e.target.value;
    } else {
        emailValue = document.querySelector("#emailField").value;
    }
    

    if (emailValue.length > 0) {
        // loading when throttle
        emailFeedback.innerHTML = genericThrottle;

        fetch("/authentication/validate-email", {
            method : 'POST',
            body: JSON.stringify({
                email: emailValue
            })
        })
        .then(response => response.json())
        .then(result => {

            if (result.email_error) {
                emailField.classList.remove("is-valid");
                emailField.classList.add("is-invalid");

                emailFeedback.classList.remove("valid-feedback");
                emailFeedback.classList.add("invalid-feedback");

                emailFeedback.innerHTML = `<p> ${result.email_error} </p>`;

            }

            if (result.email_valid) {
                emailField.classList.remove("is-invalid");
                emailField.classList.add("is-valid");

                emailFeedback.classList.remove("invalid-feedback");
                emailFeedback.classList.add("valid-feedback");

                emailFeedback.innerHTML = `<p> ${result.email_valid} </p>`;
                
                validEmail = true;
            }

            toggleRegisterButton();

        })
    } else {
        emailField.classList.remove("is-valid");
        emailField.classList.remove("is-invalid");

        emailFeedback.classList.remove("invalid-feedback");
        emailFeedback.classList.remove("valid-feedback");
        
        emailFeedback.innerHTML = null;

        registerButton.disabled = true;
    }
}

function validateUsername(e) {
    // username is invalid prior ajax validation on key change
    validUsername = false;
    let usernameValue;
    if (e != null) {
        usernameValue = e.target.value;
    } else {
        usernameValue = document.querySelector("#usernameField").value;
    }

    if (usernameValue.length > 0) {

        // loading when throttle
        usernameFeedback.innerHTML = genericThrottle;

        fetch("/authentication/validate-username", {
            method : 'POST',
            body: JSON.stringify({
                username: usernameValue
            })
        })
        .then(response => response.json())
        .then(result => {

            if (result.username_error) {
                usernameField.classList.remove("is-valid");
                usernameField.classList.add("is-invalid");

                usernameFeedback.classList.remove("valid-feedback");
                usernameFeedback.classList.add("invalid-feedback");

                usernameFeedback.innerHTML = `<p> ${result.username_error} </p>`;
            }

            if (result.username_valid) {
                usernameField.classList.remove("is-invalid");
                usernameField.classList.add("is-valid"); 

                usernameFeedback.classList.remove("invalid-feedback");
                usernameFeedback.classList.add("valid-feedback");

                usernameFeedback.innerHTML = `<p> ${result.username_valid} </p>`;

                // username is valid
                validUsername = true;
            }

            toggleRegisterButton();

        })
    } else {
        usernameField.classList.remove("is-valid");
        usernameField.classList.remove("is-invalid");

        usernameFeedback.classList.remove("invalid-feedback");
        usernameFeedback.classList.remove("valid-feedback");

        usernameFeedback.innerHTML = null;

        registerButton.disabled = true;
    }

}


