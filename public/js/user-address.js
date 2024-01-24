
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

// function validateAltMobileNumber() {
//     var mobileNumberPattern = /^[0-9]{10}$/ 
//     var name1 = document.getElementById("altMobile").value;
//     var msg1 = document.getElementById("altMobileMsg");
//     if (mobileNumberPattern.test(name1)) {
//     msg1.innerHTML = "";
//     return true
//     } else {
//     msg1.innerHTML = "Enter a valid 10 digit mobile number";
//     }
// }



function validateUserAddress() {
    var userAddressPattern = /^[a-zA-Z0-9][a-zA-Z0-9_\s ]{2,50}[a-zA-Z0-9]$/
    // var usernamePattern=/^[a-zA-Z](?:[a-zA-Z0-9_ ]{3,20}[a-zA-Z0-9_])?$/
    var name = document.getElementById("address").value;
    var msg = document.getElementById("addressCheck");
    if ( userAddressPattern .test(name)) {
    msg.innerHTML = "";
    return true
    } else {
    msg.innerHTML = "address must be atleast three character  other than space, max 60 character allowed";
    }
    }

function validateUserCity() {
    var userCityPattern = /^[a-zA-Z][a-zA-Z0-9_\s ]{1,28}[a-zA-Z0-9]$/
    // var usernamePattern=/^[a-zA-Z](?:[a-zA-Z0-9_ ]{3,20}[a-zA-Z0-9_])?$/
    var name = document.getElementById("city").value;
    var msg = document.getElementById("cityCheck");
    if ( userCityPattern .test(name)) {
    msg.innerHTML = "";
    return true
    } else {
    msg.innerHTML =  "City must be atleast three character starting with letter and other than space,max 30 character allowed";
    }
    }

    function validateUserState() {
    var userStatePattern = /^[a-zA-Z][a-zA-Z0-9_\s ]{1,28}[a-zA-Z0-9]$/
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