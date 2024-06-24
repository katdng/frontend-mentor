
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("query-type-row").addEventListener("click", (e) => {
        document.querySelectorAll('input[name="query-type"]').forEach((el) => {
            // Deselect all others
            if (el.id !== e.target.id) {
                el.checked = false;
                el.parentElement.classList.remove("query-type-selected");
            }
            else {
                el.parentElement.classList.add("query-type-selected");
            }
        })
    })

    document.getElementById("contact-form").addEventListener("submit", (e) => {
        e.preventDefault();

        let errExists = false;

        // Clear errors
        e.target.querySelectorAll(".error").forEach((el) => {
            el.style.display = "none";
            const inputEl = el.parentElement.querySelector(".input-error");
            if (inputEl)
                inputEl.classList.remove("input-error");
        });

        // Check text input fields
        e.target.querySelectorAll("input").forEach((el) => {
            if (el.id === "email" && !(/[a-zA-Z\d]+@[a-zA-Z]+.[a-z]{1,3}/.test(el.value))) {
                el.parentElement.querySelector(".error").style.display = "block";
                el.classList.add("input-error");
                errExists = true;
            }
            else if (el.id === "consent" && !el.checked) {
                e.target.querySelector("#agree-row").parentElement.querySelector(".error").style.display = "block";
                errExists = true;
            }
            else if (el.getAttribute("name") !== "query-type" && !el.value.trim()) {
                el.parentElement.querySelector(".error").style.display = "block";
                el.classList.add("input-error");
                errExists = true;
            }
        })

        // Check radio button
        const queryTypes = Array.from(e.target.querySelectorAll('input[name="query-type"]')).map((el) => el.checked);
        if (queryTypes.every(val => !val)) {
            e.target.querySelector("#query-type-row").parentElement.querySelector(".error").style.display = "block";
            errExists = true;
        }

        // Check message textarea field
        const msgEl = e.target.querySelector("#message");
        const msg = msgEl.value;
        if (!msg.trim()) {
            msgEl.parentElement.querySelector(".error").style.display = "block";
            msgEl.classList.add("input-error");
            errExists = true;
        }

        if (!errExists) {
            document.getElementById("toast-container").style.display = "block";

            // Clear form values
            e.target.querySelectorAll("input").forEach((el) => {
                if (el.type === "checkbox" || el.type === "radio") {
                    el.checked = false;

                    if (el.type === "radio")
                        el.parentElement.classList.remove("query-type-selected");
                }
                else {
                    el.value = "";
                }
            })

            e.target.querySelector("#message").value = "";
        }
    })
});
