
document.addEventListener("DOMContentLoaded", () => {
    let id = 0;

    const cartContents = document.getElementById("cart-contents");
    const thumbnailCtr = document.getElementById("thumbnails");

    let product = {
       name: "Fall Limited Edition Sneakers",
       img: "images/image-product-1.jpg",
       price: 125,
       quantity: 0,
       getTotal() {
            return parseInt(this.quantity) * parseFloat(this.price);
       }
    };

    document.getElementById("quantity-decr").addEventListener("click", () => {
        let quantity = parseInt(document.getElementById("quantity").innerHTML);
        if (quantity > 0)
            document.getElementById("quantity").innerHTML = (--quantity);
    })

    document.getElementById("quantity-incr").addEventListener("click", () => {
        let quantity = parseInt(document.getElementById("quantity").innerHTML);
        document.getElementById("quantity").innerHTML = (++quantity);
    })

    document.getElementById("cart-btn").addEventListener("click", () => {
        const dropdownEl = document.getElementById("cart-dropdown-content");

        if (dropdownEl.classList.contains("show-dropdown"))
            document.getElementById("cart-dropdown-content").classList.remove("show-dropdown");
        else
            document.getElementById("cart-dropdown-content").classList.add("show-dropdown");
    })

    document.getElementById("add-cart").addEventListener("click", () => {
        const quantity = document.getElementById("quantity").innerHTML;
        if (quantity > 0) {
            // Add object to cart
            const newProduct = {...product};
            newProduct.quantity = quantity;
            newProduct.id = ++id;

            // Create new object
            const cartProduct = document.querySelector(".cart-content").cloneNode(true);
            cartProduct.querySelector(".card-content-image > img").setAttribute("src", newProduct.img);
            cartProduct.querySelector(".cart-product-name").innerHTML = newProduct.name;
            cartProduct.querySelector(".cart-product-price").innerHTML = newProduct.price;
            cartProduct.querySelector(".cart-product-quantity").innerHTML = newProduct.quantity;
            cartProduct.querySelector(".cart-product-total").innerHTML = `$${newProduct.getTotal()}`;
            cartProduct.style.display = "grid";

            // Add delete btn event listener
            cartProduct.querySelector(".delete-btn").addEventListener("click", handleCartProductDelete);

            // Add to HTML
            cartContents.appendChild(cartProduct);

            // Update badge content
            document.getElementById("cart-btn").classList.add("cart-badge");
            document.getElementById("cart-btn").setAttribute("data-count", cartContents.children.length);

            // Display/hide necessary components
            document.getElementById("empty-cart-contents").style.display = "none";
            document.getElementById("checkout-btn").style.display = "block";

            // Reset counter on product info
            document.getElementById("quantity").innerHTML = 0;

            // Open cart
            document.getElementById("cart-dropdown-content").classList.add("show-dropdown");
        }
    })

    document.querySelectorAll(".thumbnail").forEach((el) => {
        el.addEventListener("click", (e) => {
            // Remove selected from other thumbnail
            thumbnailCtr.querySelector(".selected").classList.remove("selected");

            // Add selected to this thumbnail
            e.currentTarget.parentElement.classList.add("selected");

            // Modify main image
            let targetImgSrc = e.currentTarget.querySelector("img").getAttribute("src");
            targetImgSrc = targetImgSrc.replace("-thumbnail", "");
            document.getElementById("main-img").setAttribute("src", targetImgSrc);
        })
    })

    function handleCartProductDelete(e) {
        const target = e.currentTarget;
        const productCtr = target.closest(".cart-content");

        // Remove event listener
        this.removeEventListener("click", handleCartProductDelete);
        productCtr.remove();

        // Update badge
        if (!cartContents.children.length) {
            document.getElementById("empty-cart-contents").style.display = "flex";
            document.getElementById("checkout-btn").style.display = "none";

            document.getElementById("cart-btn").classList.remove("cart-badge");
        }

        document.getElementById("cart-btn").setAttribute("data-count", cartContents.children.length);
    }
})