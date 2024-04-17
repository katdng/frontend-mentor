document.addEventListener("DOMContentLoaded", () => {
    let expensesData = {};

    fetch("data.json")
        .then(resp => resp.json())
        .then(resp => {
            expensesData = resp;
            let currDay = new Date().toLocaleString('en-us', {weekday:'long'}).toLowerCase();
            resp.forEach(({day, amount}) => {
                let el = document.getElementById(day);
                el.style.height = `${amount}%`;

                if (currDay.includes(day))
                    el.style.backgroundColor = "hsl(186, 34%, 60%)";
            });
        })

    document.getElementById("graph").addEventListener('mouseover', (e) => {
        let id = e.target.id;
        if (id && id !== "graph") {
            let {amount} = expensesData.filter(({day, amount}) => id === day)[0];
            let tooltip = document.getElementById(id).querySelector(".tooltip");
            tooltip.innerHTML = amount;
            tooltip.style.display = "block";
        }
    });

    document.getElementById("graph").addEventListener('mouseout', (e) => {
        let id = e.target.id;
        if (id && id !== "graph") {
            let tooltip = document.getElementById(id).querySelector(".tooltip");
            tooltip.innerHTML = "";
            tooltip.style.display = "none";
        }
    });
});