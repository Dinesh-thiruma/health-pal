const idForm = document.getElementById('idForm');
const emailInput = document.getElementById('emailInput')
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');

function createAccount() {
    idForm.style.display="block";
    loginButton.innerHTML = "Create Account";
}

function login() {
    idForm.style.display="block";
    loginButton.innerHTML = "Login";
}

function loginButtonClicked() {
    if(passwordInput.innerHTML === "" || emailInput.innerHTML === "") {
        return;
    }

    if(loginButton.innerHTML === "Login") {
        console.log("Log In");
    }else {
        console.log("Create Account");
    }
}