const nodemailer = require('nodemailer')
const OTP = require('../models/otpSchema')
const flash = require("express-flash")

// otp undakunnu
module.exports = {
    generateOTP: () => {
        return `${Math.floor(1000 + Math.random() * 9000)}`;

    },

    sendOTP: async (req, res, Email, otpToBeSent) => {
        try {
            const transporter = nodemailer.createTransport({
                port: 465,
                service: 'Gmail',
                auth: {
                    user: 'reezbike10@gmail.com',
                    pass: 'bwlj rfvb ztud povt'
                },
                secure: true,

            })


            //otp undavunnu     and   etra time valid aavanenn nirnayikkunnu
            const duration = 60 * 1000; // 60 seconds
            const createdAt = Date.now()
            const expiresAt = createdAt + duration
            const newOTP = new OTP({
                Email: Email,
                otp: otpToBeSent,
                createdAt: createdAt,
                expiresAt: expiresAt,
            });


            // Log important information for debugging
            console.log("Generated OTP:", otpToBeSent);
            console.log("Created At:", createdAt);
            console.log("Expires At:", expiresAt);

            // OTP is saving
            const createdOTPRecord = await newOTP.save();
            console.log("Saved OTP Record:", createdOTPRecord);
            // creating the Mail data
            const message = "Enter This OTP To Continue For The Verification";

            const mailData = {
                from: 'reezbike10@gmail.com',
                to: Email,
                subject: 'OTP From Bikereez',
                html: `<p>${message}</p> <p style="color: tomato; font-size: 25px; letter-spacing: 2px;"><b>${otpToBeSent}</b></p><p>This Code <b>expires in <b>${duration / 1000} seconds</b>.</p>`,
            }

            // sending mail data
            transporter.sendMail(mailData, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("Successfully send otp");
            })

            // Redirect to the page after success
            req.flash("success", "Successfully Send OTP ");
            res.redirect("/emailVerification");
        } catch (error) {
            console.log(error);
            req.flash('error', 'error occuring on this in Sending OTP')
            res.redirect('/signup');
        }
    },
    passwordSendOtp: async (req, res,Email,otpToBeSent) => {

        try {
            const transporter = nodemailer.createTransport({
                port: 465,
                service: 'Gmail',
                auth: {
                    user: 'reezbike10@gmail.com',
                    pass: 'bwlj rfvb ztud povt'
                },
                secure: true,

            })
            console.log("Email:", Email);

            //otp undavunnu     and   etra time valid aavanenn nirnayikkunnu
            const duration = 60 * 1000; // 60 seconds
            const createdAt = Date.now()
            const expiresAt = createdAt + duration

            const newOTP = new OTP({
                Email: Email,
                otp: otpToBeSent,
                createdAt: createdAt,
                expiresAt: expiresAt,
            });


            // Log important information for debugging
            console.log("Generated OTP:", otpToBeSent);
            console.log("Created At:", createdAt);
            console.log("Expires At:", expiresAt);

            // OTP is saving
            const createdOTPRecord = await newOTP.save();
            console.log("Saved OTP Record:", createdOTPRecord);
            // creating the Mail data
            const message = "Enter This OTP To Continue For The Verification";

            const mailData = {
                from: 'reezbike10@gmail.com',
                to: Email,
                subject: 'OTP From Bikereez',
                html: `<p>${message}</p> <p style="color: tomato; font-size: 25px; letter-spacing: 2px;"><b>${otpToBeSent}</b></p><p>This Code <b>expires in <b>${duration / 1000} seconds</b>.</p>`,
            }

            // sending mail data
            transporter.sendMail(mailData, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("Successfully send otp");
            })

            // Redirect to the page after success
            req.flash("success", "Successfully Send OTP ");
            res.redirect("/forgotOtpVerification");
        } catch (error) {
            console.log(error);
            req.flash('error', 'error occuring on this in Sending OTP')
            res.redirect('/login');
        }


    },


}