
document.addEventListener("DOMContentLoaded", () => {
    const jobsCtr = document.getElementById("jobs-ctr");
    const jobTemplate = document.querySelector("#jobs-ctr .job.template");
    const filterCtr = document.getElementById("filter-ctr");
    const filters = document.getElementById("filters");

    getData().then(data => {
        // Populate job listings
        data.forEach(obj => {
            let {logo, company, featured, new: newJob, position, postedAt, contract, location, languages} = obj;
            const job = jobTemplate.cloneNode(true);
            job.querySelector(".logo").setAttribute("src", logo);
            job.querySelector(".company").innerHTML = company;
            job.querySelector(".badge.new").style.display = newJob ? "block" : "none";
            job.querySelector(".badge.ftrd").style.display = featured ? "block" : "none";
            job.querySelector(".title").innerHTML = position;
            job.querySelector(".posted").innerHTML = postedAt;
            job.querySelector(".duration").innerHTML = contract;
            job.querySelector(".location").innerHTML = location;

            if (featured)
                job.classList.add("featured");

            if (languages.length) {
                const langsCtr = job.querySelector(".langs");
                const btnEl = document.createElement("button");
                btnEl.setAttribute("class", "lang-btn");

                languages.forEach(lang => {
                    const langCtr = btnEl.cloneNode(true);
                    langCtr.innerHTML = lang;
                    langsCtr.appendChild(langCtr);
                })

                // Add Event Listener
                langsCtr.addEventListener("click", handleAddFilter);
            }

            job.classList.remove("template");
            job.style.display = "grid";

            jobsCtr.appendChild(job);
        })
    })

    document.getElementById("clear-filter-btn").addEventListener("click", (e) => {
        filters.querySelectorAll(".filter:not(.template)").forEach(el => {
            deleteFilterBtnListener(el);
            el.remove();
        })
        filterCtr.style.display = "none";

        // Re-show all jobs
        jobsCtr.querySelectorAll(".job:not(.template)").forEach((el) => {
            el.style.display = "grid";
        })
    })

    async function getData() {
        let resp = await fetch("data.json");
        let data = await resp.json();
        return data;
    }

    function handleAddFilter(e) {
        const target = e.target;
        if (target.matches("button")) {
            const filterName = target.innerHTML;

            // ADD FILTER BTN
            const filter = document.querySelector(".filter.template").cloneNode(true);
            filter.classList.remove("template");
            filter.querySelector(".fname").innerHTML = filterName;

            // Add event listener
            filter.querySelector(".remove-btn").addEventListener("click", handleRemoveFilter);

            filters.appendChild(filter);

            filterCtr.style.display = "grid";

            // Update list of jobs
            filterJobs();
        }
    }

    function handleRemoveFilter(e) {
        const filter = e.target.closest(".filter");
        deleteFilterBtnListener(filter);
        filter.remove();

        if (filters.querySelectorAll(".filter:not(.template)").length === 0) {
            document.getElementById("clear-filter-btn").click();
        }
        else {
            // Update list of jobs
            filterJobs();
        }
    }

    function filterJobs() {
        // Get all applied filters
        const appliedFilters = Array.from(filters.querySelectorAll(".fname")).map(el => el.innerHTML);
        jobsCtr.querySelectorAll(".job:not(.template)").forEach((el) => {
            const langsCtr = el.querySelector(".langs");
            if (langsCtr.children !== 0) {
                const langsArr = Array.from(langsCtr.children).map((el) => el.innerHTML);
                if (!langsArr.some(lang => appliedFilters.includes(lang)))
                    el.style.display = "none";
                else
                    el.style.display = "grid";
            }
        })
    }

    function deleteFilterBtnListener(el) {
        el.querySelector(".remove-btn").removeEventListener("click", handleRemoveFilter);
    }
})