
$(document).ready(function () {
    let duration = 60; // Duration in seconds
    let countdown;

    // refere the dom elements
    const timerDisplay = $("#timer");
    const resendOtp = $("#resendOtp");
    const otpInput = $("#number");
    const emailVerificationButton = $("#emailVerification");



    //  count down aavunnath timer function update cheyyan 

    function updateTimer() {
        const minute = Math.floor(duration / 60)
        let seconds = duration % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        timerDisplay.text(`${minute}:${seconds}`);

        if (duration === 0) {
            clearInterval(countdown);
            timerDisplay.text('00:00')
            resendOtp.css("display", "block");
        } else {
            duration--;
        }
    }


    updateTimer()

    // set up the countdown 

    countdown = setInterval(updateTimer, 1000)
    // event handler for OTP validation 

    emailVerificationButton.click(function (e) {
        e.preventDefault(); // Prevent the form from submitting

        const otp = otpInput.val();

        // Use AJAX to send the OTP for validation to the server

        $.ajax({
            type: 'POST',
            url: "/emailVerification", // Update with the  URL
            data: { otp: otp },  // send otp as data
            success: function (response) {
                console.log('Response from server:', response);
                if (response.success) {
                    clearInterval(countdown);
                    timerDisplay.text("OTP Validated");

                    // redirected to homepage

                    window.location.href = '/loginpage-user'
                } else {
                    // Handle unsuccessful OTP validation
                    alert("Invalid OTP. Please try again.");
                }
            },
            error: function () {
                alert("An error occurred while validating OTP.");
            },
        })
        console.log('data');
    })
})
