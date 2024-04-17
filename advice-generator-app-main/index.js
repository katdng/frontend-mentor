
document.addEventListener("DOMContentLoaded", () => {
    async function getAdvice() {
        let dataResp = await fetch("https://api.adviceslip.com/advice");
        let jsonResp = await dataResp.json();
        return jsonResp;
    }

    getAdvice().then((data) => {
        if (data) {
            const {slip: {id, advice}} = data;

            document.getElementById("advice-id").innerHTML = id;
            document.getElementById("advice").innerHTML = `"${advice}"`;
        }
    });


    document.getElementById("dice-btn").addEventListener("click", () => {
        getAdvice().then((data) => {
            if (data) {
                const {slip: {id, advice}} = data;

                document.getElementById("advice-id").innerHTML = id;
                document.getElementById("advice").innerHTML = `"${advice}"`;
            }
        });
    });
});