document.addEventListener("DOMContentLoaded", function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token');

    const form = document.getElementById("restaurar");

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const data = new FormData(form);
        const obj = {};
        data.forEach((value, key) => obj[key] = value);

        fetch(`/api/sessions/resetpassword?token=${token}`, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(result => {
            if (result.status === 200) {
                console.log("Contraseña restaurada");
            } else {
                console.log("Error");
                console.log(result);
            }
        }).catch(error => {
            console.error("Error:", error);
        });
    });
});