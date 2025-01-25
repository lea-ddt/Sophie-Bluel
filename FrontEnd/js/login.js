const LoginApi = "http://localhost:5678/api/users/login";

document.getElementById("formLogin").addEventListener("submit", connectionLogin);

async function connectionLogin(event) {
    event.preventDefault();
    
    let user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    };

    try {
        let response = await fetch(LoginApi, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (response.status === 200) {
            let result = await response.json();
            const token = result.token;
            sessionStorage.setItem("authtoken", token);
            console.log(token);
             window.location.href = "index.html";
        } else {
            const error = document.createElement("div");
            error.className = "error";
            error.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
            document.querySelector("form").prepend(error);
        }
    } catch (error) {
        const errorMsg = document.createElement("div");
        errorMsg.className = "error";
        errorMsg.innerHTML = "Une erreur s'est produite, veuillez réessayer plus tard.";
        document.querySelector("form").prepend(errorMsg);
    }
}