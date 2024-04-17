document.addEventListener("DOMContentLoaded", () => {

    function handleFeatureBtnClick(e) {
        // Get status of current target + icon
        let id = e.target.id;
        let btnEl = document.getElementById(id);
        let iconEl = btnEl.querySelector("img");
        let setOpen = iconEl.getAttribute("src").includes("down");

        // Close all other dropdowns & change the dropdown icon to down
        document.getElementById("nav-links-col").querySelectorAll(".dropdown-content").forEach(el => {
            el.classList.remove("show-dropdown");
            el.parentElement.querySelector("button > img").setAttribute("src", "images/icon-arrow-down.svg");
        });

        // Set the dropdown icon & open/close the target dropdown based on previous state
        iconEl.setAttribute("src", `images/icon-arrow-${setOpen ?"up" : "down"}.svg`);
        let dropdownEl = btnEl.parentElement.querySelector(".dropdown-content");
        if (setOpen){
            dropdownEl.classList.add("show-dropdown");
        } else {
            dropdownEl.classList.remove("show-dropdown");
        }
    };

    function handleDropdownClose(e) {
        let linkEl = e.target;
        let dropdownEl = linkEl.parentElement;

        // Close the dropdown
        dropdownEl.classList.remove("show-dropdown");

        // Change the dropdown icon
        dropdownEl.parentElement.querySelector("button > img").setAttribute("src", "images/icon-arrow-down.svg");
    }


    // Add event listeners
    document.getElementById("features-btn").addEventListener('click', handleFeatureBtnClick);
    document.getElementById("company-btn").addEventListener('click', handleFeatureBtnClick);

    document.querySelectorAll(".dropdown-content").forEach(el => {
        el.addEventListener("click", handleDropdownClose);
    })
})