const genericThrottle = ` <div class="spinner-border spinner-border-sm text-warning" role="status">
<span class="visually-hidden">Loading...</span>
</div>
<span class="text-warning">loading</span>
`

const passwordField = document.querySelector("#passwordField");
const passwordFeedback = document.querySelector("#validationServerPasswordFeedback");
let validPassword = false;

const passwordCfmField = document.querySelector("#confirm-passwordField");
const passwordCfmFeedback = document.querySelector("#validationServerConfirmPasswordFeedback");
let validMatchingPassword = false;

const resetBtn = document.querySelector("#set-new-password-btn");

passwordField.addEventListener("pageshow", function() {
    validatePassword(null);
    toggleResetButton();
})

passwordField.addEventListener("keyup", e => validatePassword(e));
passwordCfmField.addEventListener("keyup", e => validateCfmPassword(e));


function validateCfmPassword(e) {
    cfmPasswordValue = e.target.value;
    if (cfmPasswordValue.length == 0) {
        validMatchingPassword = false;
        passwordCfmField.classList.remove("is-invalid");
        passwordCfmField.classList.remove("is-valid");

        passwordCfmFeedback.classList.remove("invalid-feedback");
        passwordCfmFeedback.classList.remove("valid-feedback");

        passwordCfmFeedback.innerHTML = null

    } else {
        if (cfmPasswordValue == document.querySelector("#passwordField").value) {
            passwordCfmField.classList.remove("is-invalid");
            passwordCfmField.classList.add("is-valid");
    
            passwordCfmFeedback.classList.remove("invalid-feedback");
            passwordCfmFeedback.classList.add("valid-feedback");
    
            passwordCfmFeedback.innerHTML = `<p>Looks good!</p>`;
    
            validMatchingPassword = true;
        } else {
            passwordCfmField.classList.remove("is-valid");
            passwordCfmField.classList.add("is-invalid");
    
            passwordCfmFeedback.classList.remove("valid-feedback");
            passwordCfmFeedback.classList.add("invalid-feedback");
    
            passwordCfmFeedback.innerHTML = `<p>Passwords do not match.</p>`;
    
            validMatchingPassword = false;
        }
    }

    toggleResetButton();
    
}

function toggleResetButton() {
    if (validPassword && validMatchingPassword) {
        resetBtn.disabled = false;
    } else {
        resetBtn.disabled = true;
    }
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

            toggleResetButton();

        })
    } else {
        passwordField.classList.remove("is-valid");
        passwordField.classList.remove("is-invalid");

        passwordFeedback.classList.remove("invalid-feedback");
        passwordFeedback.classList.remove("valid-feedback");
        
        passwordFeedback.innerHTML = null;

        resetBtn.disabled = true;
    }
}