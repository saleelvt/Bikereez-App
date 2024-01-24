// ...............................................................User Signup Page Validation..............................................................

    
    //function to check the username//
    function validateUserName() {
        var usernamePattern = /^[a-zA-Z][a-zA-Z0-9_ ]{1,28}[a-zA-Z0-9]$/
        // var usernamePattern=/^[a-zA-Z](?:[a-zA-Z0-9_ ]{3,20}[a-zA-Z0-9_])?$/
        var name = document.getElementById("name").value;
        var msg = document.getElementById("nameCheck");
        if (usernamePattern.test(name)) {
        msg.innerHTML = "";
        return true
        } else {
        msg.innerHTML = "Username must be 3-30 characters starts with a letter and only letters, digits, spaces inside and underscore permitted";
        }
        }

//function to check the email address//
    function validateUserEmail() {
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        var email = document.getElementById("email").value;
        var msg = document.getElementById("emailCheck");
        if (emailPattern.test(email)) {
            msg.innerHTML = "";
            return true
        } else {
            msg.innerHTML = "Invalid email address";
        }
        }
    
// Function to validate the password
    function validatePassword() {
        var msg=document.getElementById("messagePwd")
        var password = document.getElementById("password").value;
        var regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@*&!#^%])[A-Za-z\d@*&!#^%]{8,}$/ // This regex allows only letters,numbers, '@', and underscores and requires at least 8 characters.
        if (regex.test(password)) {
            msg.innerHTML=""   
            return true         
        } else {
            msg.innerHTML="Password is invalid. It should contain at least 8 character and must consist  of atleast one letters,numbers,and special character"
        }
        }
// Function to validate the password
    function validatePassword1() {
        var msg=document.getElementById("messagePwd1")
        var password = document.getElementById("password1").value;
        var regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@*&!#^%])[A-Za-z\d@*&!#^%]{8,}$/ // This regex allows only letters,numbers, '@', and underscores and requires at least 8 characters.
        if (regex.test(password)) {
             new
            msg.innerHTML=""   
            return true         
        } else {
            msg.innerHTML="Password is invalid. It should contain at least 8 character and must consist  of atleast one letters,numbers,and special character"
        }
        }

//function to check the passwords are equal//
    function checkPasswordMatch() {
        var password = document.getElementById("password").value;
        var confirmPassword = document.getElementById("confirmPassword").value;
        var msg = document.getElementById("messagePwdMatch");           
        if (password === confirmPassword) {
        msg.innerHTML = "" // Clear the error message 
        return true          
        } else {
        msg.innerHTML = "Passwords do not match. Please try again."            
        }
        }

        function validateInput2(stocks) {
            var validationMessage3 = document.getElementById('validationMessage3');
            if (stocks.value < 0) {
                stocks.setCustomValidity('Value must not be less than 0');
                validationMessage3.textContent = 'Value for stock must not be less than 0';
            }else {
                stocks.setCustomValidity('');
                validationMessage3.textContent = '';
            }
        }

// ...............................................................End of User Signup Page Validation..............................................................





// ...............................................................Product Page Validation..............................................................

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

function validateProductDescription() {
            var productDescriptionPattern = /^[a-zA-Z0-9][a-zA-Z0-9_ ]{0,198}[a-zA-Z0-9]$/
            // var usernamePattern=/^[a-zA-Z](?:[a-zA-Z0-9_ ]{3,20}[a-zA-Z0-9_])?$/
            var name = document.getElementById("Description").value;
            var msg = document.getElementById("descriptionError");
            if (productDescriptionPattern.test(name)) {
            msg.innerHTML = "";
            return true
            } else {
            msg.innerHTML = "product description must be atleast two character starting with letter and other than space,only underscore,letters and numbers allowed and max of 200 characters";
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
            msg.innerHTML = "Product tags must be atleast two character starting with letter and other than space,only underscore,letters and numbers allowed and max of 1000 characters";
            }
}

function validatePrices() {
    var productPrice = parseFloat(document.getElementById("productPrice").value);
    var discountPrice = parseFloat(document.getElementById("discountPrice").value);

    var validationMessage1 = document.getElementById("validationMessage1");
    var validationMessage2 = document.getElementById("validationMessage2");
    var discountError = document.getElementById("discountError");

    // Validate product price
    if (isNaN(productPrice) || productPrice < 0) {
        validationMessage1.innerHTML = "Please enter a valid product price.";
    } else {
        validationMessage1.innerHTML = "";
    }

    // Validate discount price
    if (isNaN(discountPrice) || discountPrice < 0) {
        validationMessage2.innerHTML = "Please enter a valid discount price.";
    } else {
        validationMessage2.innerHTML = "";
    }

    // Check if discount price is greater than product price
    if (!isNaN(productPrice) && !isNaN(discountPrice) && discountPrice >= productPrice) {
        discountError.innerHTML = "Discount price must be less than product price";
    } else {
        discountError.innerHTML = "";
    }
}

// ............................................................... End of Product Page Validation..............................................................


// ............................................................... User Address Page Validation..............................................................

function validatePincode() {
    var pincodePattern = /^[0-9]{6}$/            
    var name = document.getElementById("pincode").value;
    var msg = document.getElementById("pincodeMsg");
    if (pincodePattern.test(name)) {
    msg.innerHTML = "";
    return true
    } else {
    msg.innerHTML = "Enter a valid 6 digit pincode";
    }           
    }

function validateMobileNumber() {
    var mobileNumberPattern = /^[0-9]{10}$/            
    var name = document.getElementById("mobile").value;
    var msg = document.getElementById("mobileMsg");
    if (mobileNumberPattern.test(name)) {
    msg.innerHTML = "";
    return true
    } else {
    msg.innerHTML = "Enter a valid 10 digit mobile number";
    }           
    }

function validateAltMobileNumber() {
    var mobileNumberPattern = /^[0-9]{10}$/ 
    var name1 = document.getElementById("altMobile").value;
    var msg1 = document.getElementById("altMobileMsg");
    if (mobileNumberPattern.test(name1)) {
    msg1.innerHTML = "";
    return true
    } else {
    msg1.innerHTML = "Enter a valid 10 digit mobile number";
    }
}


function validateUserAddress() {
    var userAddressPattern = /^[a-zA-Z0-9][a-zA-Z0-9_ ]{1,98}[a-zA-Z0-9]$/
    // var usernamePattern=/^[a-zA-Z](?:[a-zA-Z0-9_ ]{3,20}[a-zA-Z0-9_])?$/
    var name = document.getElementById("address").value;
    var msg = document.getElementById("addressCheck");
    if ( userAddressPattern .test(name)) {
    msg.innerHTML = "";
    return true
    } else {
    msg.innerHTML = "address must be atleast three character  other than space, max 100 character allowed";
    }
    }

function validateUserCity() {
    var userCityPattern = /^[a-zA-Z][a-zA-Z0-9_ ]{1,28}[a-zA-Z0-9]$/
    // var usernamePattern=/^[a-zA-Z](?:[a-zA-Z0-9_ ]{3,20}[a-zA-Z0-9_])?$/
    var name = document.getElementById("city").value;
    var msg = document.getElementById("cityCheck");
    if ( userCityPattern .test(name)) {
    msg.innerHTML = "";
    return true
    } else {
    msg.innerHTML = "City must be atleast three character starting with letter and other than space,max 30 character allowed";
    }
    }

    function validateUserState() {
    var userStatePattern = /^[a-zA-Z][a-zA-Z0-9_ ]{1,28}[a-zA-Z0-9]$/
    // var usernamePattern=/^[a-zA-Z](?:[a-zA-Z0-9_ ]{3,20}[a-zA-Z0-9_])?$/
    var name = document.getElementById("state").value;
    var msg = document.getElementById("stateCheck");
    if ( userStatePattern .test(name)) {
    msg.innerHTML = "";
    return true
    } else {
    msg.innerHTML = "State must be atleast three character starting with letter and other than space,max 30 character allowed";
    }
    }
// ...............................................................End of User Address Page Validation..............................................................

//................................................................coupon validation ..............................................................
function validateCouponName() {
var usernamePattern = /^[a-zA-Z][a-zA-Z0-9_ ]{1,28}[a-zA-Z0-9]$/
// var usernamePattern=/^[a-zA-Z](?:[a-zA-Z0-9_ ]{3,20}[a-zA-Z0-9_])?$/
var name = document.getElementById("name").value;
var msg = document.getElementById("nameCheck");
if (usernamePattern.test(name)) {
msg.innerHTML = "";
return true
} else {
msg.innerHTML = "Coupon name must be 3-30 characters starts with a letter and only letters, digits, spaces inside and underscore permitted";
}
}



function validateDates() {
    const startDate = new Date(document.getElementById('valid_from').value);
    startDate.setMinutes(startDate.getMinutes() + 2);
    const endDate = new Date(document.getElementById('valid_to').value);
    const currentDate = new Date(); 
    if (startDate < currentDate) {
        document.getElementById('dateValidationMessage').innerText = "Start date must be later than or equal to the current date";
        return false;
    } else if (startDate >= endDate) {
        document.getElementById('dateValidationMessage').innerText = "Start date must be earlier than End date";
        return false;
    } else {
        document.getElementById('dateValidationMessage').innerText = "";
        return true;
    }
}