document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("email-submit-btn").addEventListener("click", (e) => {
        const errEl = document.getElementById("email-error");
        errEl.style.display = "none";

        const email = document.getElementById("email").value.trim();

        if (!email) {
            errEl.style.display = "block";
            return;
        }

        const isValid = /^([a-zA-Z]+)(@)[a-zA-Z]+([.])[a-z]{3}$/.test(email);
        if (!isValid) {
            errEl.style.display = "block";
            return;
        }
        document.getElementById("email").value = "";
    })
})