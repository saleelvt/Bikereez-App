
//  --------------------------validation for products=================================================

function validateForm() {
    const basePrice = parseFloat(document.getElementById('basePrice').value);
    var msg1 = document.getElementById("priceCheck")
    const discountAmount = parseFloat(document.getElementById('discountAmount').value);
    var msg2 = document.getElementById("discountCheck")
    const quantity = parseFloat(document.getElementById('quantity').value);
    var msg3 = document.getElementById("quantityCheck")

    if (basePrice <= 0) {
        msg1.innerHTML = "'Please enter valid values for pricing.. ";
        return false
    } else {
        msg1.innerHTML = "";
        // return true;
    }
    if (discountAmount < 0 || discountAmount > basePrice) {
        msg2.innerHTML = "'Please enter valid values for discountAmount.. ";
        return false
    } else {
        msg2.innerHTML = "";
        // return true
    }
    if (quantity < 0) {
        msg3.innerHTML = "'Please enter valid values for Quantity.. ";
        return false
    } else {
        msg3.innerHTML = "";
        // return true
    }
    return true
}

function validateProductName() {
    var productNamePattern = /^[a-zA-Z0-9][a-zA-Z0-9_ ]{0,48}[a-zA-Z0-9]$/
    // var usernamePattern=/^[a-zA-Z](?:[a-zA-Z0-9_ ]{3,20}[a-zA-Z0-9_])?$/
    var name = document.getElementById("name").value;
    var msg = document.getElementById("nameError");
    if (productNamePattern.test(name)) {
    msg.innerHTML = "";
    return true
    } else {
    msg.innerHTML = "product name must be atleast two character starting with letter and other than space,only underscore,letters and numbers allowed and max of 50 characters";
    }
    }




//     function validateProductDescription() {
//         var productDescriptionPattern = /^[a-zA-Z0-9][a-zA-Z0-9_ ]{0,198}[a-zA-Z0-9]$/
//         // var usernamePattern=/^[a-zA-Z](?:[a-zA-Z0-9_ ]{3,20}[a-zA-Z0-9_])?$/
//         var name = document.getElementById("description").value;
//         var msg = document.getElementById("descriptionError");
//         if (productDescriptionPattern.test(name)) {
//         msg.innerHTML = "";
//         return true
//         } else {
//         msg.innerHTML = "product description must be atleast two character starting with letter and other than space,only underscore,letters and numbers allowed and max of 200 characters";
//         }
// }

function validateProductDescription() {
    var productDescriptionPattern =/^[a-zA-Z0-9][a-zA-Z0-9_ ]{0,198}[a-zA-Z0-9]$/
    var name = document.getElementById("description").value.trim();
    var msg = document.getElementById("descriptionError");

    // Allow any printable character (including special characters) and a maximum length of 200
    if (name.length >= 2 && /^[\x20-\x7E]{0,200}$/.test(name) && productDescriptionPattern.test(name)) {
        msg.innerHTML = "";
        return true;
    } else {
        msg.innerHTML = "Product description must be at least two characters, starting with a letter, and allowing only printable characters (including special characters), spaces, and underscores. Maximum of 200 characters.";
        return false;
    }
}




function validateProductTags() {
    var productTagsPattern = /^[a-zA-Z0-9][a-zA-Z0-9_ ]{0,1998}[a-zA-Z0-9]$/
    // var usernamePattern=/^[a-zA-Z](?:[a-zA-Z0-9_ ]{3,20}[a-zA-Z0-9_])?$/
    var name = document.getElementById("Tags").value;
    var msg = document.getElementById("tagsError");
    if (productTagsPattern.test(name)) {
    msg.innerHTML = "";
    return true
    } else {
    msg.innerHTML = "Product tags must be atleast two character starting with letter and other than space,only underscore,letters and numbers allowed and max of 100 characters";
    }
}