

function validateDiscount() {
    var discountPattern = /^([1-9]|[1-9][0-9]|100)$/; // Regular expression for values between 1 and 100
    var name = document.getElementById("discount").value;
    console.log(name);
    var msg = document.getElementById("discountCheck");
    
    if (discountPattern.test(name)) {
        msg.innerHTML = "";
        return true;
    } else {
        msg.innerHTML = "Discount Amount must be between 1 and 100";
        return false;
    }
}
