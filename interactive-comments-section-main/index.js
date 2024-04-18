
document.addEventListener("DOMContentLoaded", () => {
    let state = {};
    let commentToDelete = null;
    const cardCtrTemplate = document.querySelector(".hidden-card-template");
    const cardTemplate = cardCtrTemplate.querySelector(".card");
    const replyCtrTemplate = document.querySelector(".hidden-reply-template");
    const newCommentCtrTemplate = document.querySelector(".new-comment-grid");

    getData()
        .then((data) => state = data)
        .then(() => {
            // Add initial comments
            state.comments.forEach((comment) => {
                const commentCtr = cardCtrTemplate.cloneNode(true);
                setupCard(commentCtr, comment);

                // Add any replies to the comment
                const {replies} = comment;
                if (replies.length) {
                    const replyCtr = replyCtrTemplate.cloneNode(true);
                    replyCtr.classList.remove("hidden-reply-template");
                    const replyComments = replyCtr.querySelector(".reply-comments");

                    replies.forEach((reply) => {
                        let replyCard = cardTemplate.cloneNode(true);
                        replyCard.classList.add("reply-card");
                        setupCard(replyCard, reply);
                        replyComments.appendChild(replyCard);
                    })

                    commentCtr.appendChild(replyCtr);
                }

                // Add comment container to main comments
                document.getElementById("comments-grid").appendChild(commentCtr);
            });

            // Populate the current user avatar
            document.querySelectorAll(".current-user").forEach((el) => {
                el.querySelector("img").setAttribute("src", state.currentUser.image.webp);
            });
        });

    async function getData() {
        let resp = await fetch("data.json");
        let dataResp = await resp.json();
        return dataResp;
    };

    function setupCard(commentCtr, comment) {
        const {content, score = 0, createdAt = "Today", user: {image: {webp}, username}, replyingTo} = comment;
        commentCtr.querySelector(".rating-num").innerHTML = score;
        commentCtr.querySelector(".avatar > img").setAttribute("src", webp);
        commentCtr.querySelector(".username").innerHTML = username;
        commentCtr.querySelector(".post-date").innerHTML = createdAt;
        commentCtr.querySelector(".comment").innerHTML =
            `${replyingTo ? '<a href="#" class="reply-to">@' + replyingTo + '</a>' : ""} <span>${content}</span`;

        // Event listener for incr/decr ratings
        commentCtr.querySelector(".rating").addEventListener("click", handleRatingBtnClick);

        // Handle whether comment/reply belongs to current user
        const btnContainer = commentCtr.querySelector(".btn-container");
        if (state.currentUser.username === username) {
            // Create "YOU" badge
            const badge = document.createElement("div")
            badge.setAttribute("class", "current-user-badge");
            badge.innerHTML = "you";

            const usernameEl = commentCtr.querySelector(".username");
            usernameEl.parentElement.insertBefore(badge, usernameEl.nextSibling);

            // If the currentUser is the owner of this comment/reply, add Delete & Edit btn; Remove Reply btn
            btnContainer.querySelector(".reply-btn").remove();

            // Create delete btn
            const deleteBtn = document.createElement("button");
            deleteBtn.setAttribute("class", "delete-btn");
            deleteBtn.innerHTML = '<img src="images/icon-delete.svg">Delete';
            deleteBtn.addEventListener("click", handleDeleteClick);
            btnContainer.appendChild(deleteBtn);

            // Create edit btn
            let editBtn = document.createElement("button");
            editBtn.setAttribute("class", "edit-btn");
            editBtn.innerHTML = '<img src="images/icon-edit.svg">Edit';
            editBtn.addEventListener("click", handleEditClick);
            btnContainer.appendChild(editBtn);

        } else {
            // Different owner than current user
            btnContainer.querySelector(".reply-btn").addEventListener("click", handleReplyBtnClick);
        };

        commentCtr.classList.remove("hidden-card-template");
    }

    function handleRatingBtnClick(e) {
        // Incr/decr rating
        const ratingBtn = e.target.tagName === "IMG" ? e.target.closest("button") : e.target;

        if (!ratingBtn.className.includes("rating-num")) {
            let ratingNumEl = ratingBtn.closest(".rating").querySelector(".rating-num");
            let ratingNum = parseInt(ratingNumEl.innerHTML);
            ratingNumEl.innerHTML = ratingBtn.className.includes("plus") ? ++ratingNum : --ratingNum;
        }
    }

    function handleReplyBtnClick(e) {
        const replyBtn = e.currentTarget;
        const parentCardContainer = replyBtn.closest(".card-container");
        const parentCard = parentCardContainer.querySelector(".card");
        const replyingTo = replyBtn.closest(".card").querySelector(".username").innerHTML;

        // Create a new reply text area
        const newCommentCtr = newCommentCtrTemplate.cloneNode(true);
        const replySubmitBtn = newCommentCtr.querySelector("button");
        replySubmitBtn.innerHTML = "REPLY";

        // Add event listener on SUBMIT reply btn
        replySubmitBtn.addEventListener("click", function replySubmitBtnClick (ev) {
            // Check the new reply comment & proceed if not null
            const evNewCommentCtr = ev.currentTarget.closest(".new-comment-grid");
            const content = evNewCommentCtr.querySelector(".new-comment").value.trim();

            if (content) {
                // Create reply card
                const replyCard = cardTemplate.cloneNode(true);
                replyCard.classList.add("reply-card");
                setupCard(replyCard, { content, user: {...state.currentUser}, replyingTo });
                replyCard.classList.remove("hidden-reply-template");

                // Check if reply section exists
                const cardContainerEl = ev.currentTarget.closest(".card-container");
                const replyGrid = cardContainerEl.querySelector(".reply-grid");
                if (replyGrid) {
                    // Append to existing reply comments container
                    replyGrid.querySelector(".reply-comments").appendChild(replyCard);
                }
                else {
                    // Create a new reply comments container
                    const replyCtr = replyCtrTemplate.cloneNode(true);
                    replyCtr.classList.remove("hidden-reply-template");
                    replyCtr.querySelector(".reply-comments").appendChild(replyCard);
                    cardContainerEl.appendChild(replyCtr);
                }

                // Remove new reply box & this event listener
                evNewCommentCtr.remove();
                this.removeEventListener("click", replySubmitBtnClick);
            }
        })

        // Determine where to append new reply text area
        const replyGrid = parentCardContainer.querySelector(".reply-grid");
        if (replyGrid) {
            // If current target is a reply card, append BEFORE the current reply card;
            // Else current target is the original poster, append new comment at the end of all replies
            const replyCommentsSection = replyGrid.querySelector(".reply-comments");
            if (replyBtn.closest(".card").classList.contains("reply-card"))
                replyCommentsSection.insertBefore(newCommentCtr, e.currentTarget.closest(".card").nextSibling);
            else
                replyCommentsSection.appendChild(newCommentCtr);
        }
        else {
            parentCardContainer.appendChild(newCommentCtr);
        }
    }

    function handleEditClick(e) {
        const commentEl = e.currentTarget.closest(".card").querySelector(".comment");
        const replyingTo = commentEl.querySelector("a").innerHTML;
        const comment = commentEl.querySelector("span").innerHTML;

        // Create new textarea
        const textArea = document.createElement("textarea");
        textArea.setAttribute("class", "new-comment");
        textArea.setAttribute("rows", "3");
        textArea.value = comment;

        // Create Update button
        const updateBtnCtr = document.createElement("div");
        updateBtnCtr.setAttribute("class", "update-btn-container");
        const updateBtn = document.createElement("button");
        updateBtn.setAttribute("class", "button update-btn");
        updateBtn.innerHTML = "UPDATE";
        updateBtn.addEventListener("click", function handleEditReply(ev) {
            const evComment = textArea.value.trim();

            // Add <p>
            const pEl = document.createElement("p");
            pEl.setAttribute("class", "comment");
            pEl.innerHTML = `<a href="#" class="reply-to">${replyingTo}</a> <span>${evComment ? evComment : comment}</span`;
            textArea.parentElement.appendChild(pEl);

            // Remove text area & update btn
            this.removeEventListener("click", handleEditReply);
            updateBtnCtr.remove();
            textArea.remove();
        });

        commentEl.parentElement.appendChild(textArea);
        updateBtnCtr.appendChild(updateBtn);
        commentEl.parentElement.appendChild(updateBtnCtr);

        // Remove <p>
        commentEl.remove();
    }

    function handleDeleteClick(e) {
        document.getElementById("modal").style.display = "block";
        commentToDelete = e.currentTarget.closest(".card");
    }


    // EVENT LISTENERS
    document.querySelector("#new-comment-container button").addEventListener("click", (e) => {
        // Adds a new comment to the main comments container
        let newCommentContainer = e.target.parentElement;
        let newCommentEl = newCommentContainer.querySelector(".new-comment");
        let newComment = newCommentEl.value.trim();

        if (newComment) {
             // Only add a comment if there was non-empty comment
            let commentCtr = cardCtrTemplate.cloneNode(true);
            setupCard(commentCtr, { content: newComment, user: {...state.currentUser} });
            document.getElementById("comments-grid").appendChild(commentCtr);
            newCommentEl.value = "";
        }
    });

    // MODAL EVENT LISTENERS
    document.getElementById("modal-cancel-btn").addEventListener("click", () => {
        document.getElementById("modal").style.display = "none";
    })

    document.getElementById("modal-delete-btn").addEventListener("click", (e) => {
        // Keep a reference to the reply grid for below lines
        const replyGrid = commentToDelete.closest(".reply-grid");

        // Remove event listeners
        commentToDelete.querySelector(".delete-btn").removeEventListener("click", handleDeleteClick);
        commentToDelete.querySelector(".edit-btn").removeEventListener("click", handleEditClick);
        commentToDelete.querySelector(".rating").removeEventListener("click", handleRatingBtnClick);
        commentToDelete.remove();

        // If it is a reply comment, check if the reply comment container is empty & remove it
        if (replyGrid && !replyGrid.querySelector(".reply-comments").children.length)
            replyGrid.remove();

        document.getElementById("modal").style.display = "none";
    })
})