document.addEventListener('DOMContentLoaded', function() {

    const removeButtons = document.querySelectorAll(".remove-button");

    async function addToWishlist(clickedElement) {
        try {
            console.log("Before Swal.fire");
            const confirmation = await Swal.fire({
                icon: "question",
                title: "Add to Wishlist?",
                text: "Do you want to add this product to your wishlist?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
            });
            console.log("After Swal.fire");

            if (confirmation.isConfirmed) {
                console.log("User confirmed");

                // Retrieve the product ID from the data-product-id attribute
                const productId = clickedElement.getAttribute("data-product-id");

                // Proceed with the API call
                const response = await fetch(`/addToWishlist/${productId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        console.log(data.message);

                        await Swal.fire({
                            icon: "success",
                            title: "Added to Wishlist",
                            text: "The product has been added to your wishlist.",
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "OK",
                        });

                        // Redirect to the wishlist page
                        window.location.href = "/wishlist";
                    } else {
                        console.log("Failed to add to wishlist");
                        await Swal.fire({
                            icon: "info",
                            title: "Product Already in Wishlist",
                            text: "The product is already in your wishlist.",
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "OK",
                        });
                    }
                } else {
                    console.error("An error occurred while adding to the wishlist.");
                    throw new Error("An error occurred while adding to the wishlist.");
                }
            } else {
                console.log("User canceled or closed the dialog");
                // Handle if the user clicked "No" or closed the dialog
            }
        } catch (error) {
            console.error("Error in addToWishlist:", error);
            // Handle any errors and show an error message
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while adding to the wishlist. Please try again later.",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
        }
    }

    // Add a click event listener to the heart icon
    const heartIcon = document.getElementById("heartIcon");
    if (heartIcon) {
        heartIcon.addEventListener("click", function(event) {
            event.preventDefault(); 
            addToWishlist(this); 
        });
    }

    removeButtons.forEach((button) => {

        console.log("reached wishlist remove here ")
    
        button.addEventListener("click", (event) => {
          event.preventDefault();
    
          Swal.fire({
            title: "Remove Product",
            text: "Are you sure you want to remove this product from your Wishlist?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, remove it",
            cancelButtonText: "Cancel",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = button.href;
            }
          });
        });
      })

});
