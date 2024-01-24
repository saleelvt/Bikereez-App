function validateCouponName() {
    var usernamePattern = /^[a-zA-Z][a-zA-Z0-9_ ]{4,28}[a-zA-Z0-9]$/

    var name = document.getElementById("name").value.trim()
    var msg = document.getElementById("nameCheck");
    if (usernamePattern.test(name)) {
    msg.innerHTML = "";
    return true
    } else {
    msg.innerHTML = "Coupon name must be 4-30 characters starts with a letter and only letters, digits, spaces inside and underscore permitted";
    }
    }
    function validateDates() {
        const startDate = new Date(document.getElementById('valid_from').value);
        const endDate = new Date(document.getElementById('valid_to').value);
        const currentDate = new Date(); 
        if (startDate < currentDate) {
            document.getElementById('dateValidationMessage').innerText = "Start date must be graterthan or equal to the current date";
            return false;
        } else if (startDate < endDate) {
            document.getElementById('dateValidationMessage').innerText = "Start date must be earlier than End date";
            return false;
        } else {
            document.getElementById('dateValidationMessage').innerText = "";
            return true;
        }
    }

    function dateValidation() {
        var startDate = new Date(document.getElementById('startDate').value);
        var endDate = new Date(document.getElementById('endDate').value);
        const currentDate = new Date();
        var downBtn = document.getElementById('downBtn');
        var error = document.getElementById('error');
        if (startDate > currentDate) {
            error.innerHTML = 'Invalid date range: Start date cannot be in the future.';
            downBtn.style.display = 'none';
        } else if (endDate >= currentDate) {
            error.innerHTML = 'Invalid date range: End date cannot be in the future.';
            downBtn.style.display = 'none';
        } else if (startDate > endDate) {
            error.innerHTML = 'Invalid date range: Start date cannot be after end date.';
            downBtn.style.display = 'none';
        } else {
            error.innerHTML = '';
            downBtn.style.display = 'block';
        }
    }