// const { body, validationResult } = require('express-validator');
// const userSignupValidation = [

//     body('username')
//         .notEmpty().withMessage('Username is required')
//         .isLength({ min: 4 }).withMessage('Username must be at least 4 characters'),

        
//         body('password')
//         .notEmpty().withMessage('Password is required')
//         .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
//         .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
//         .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

//     body('conform-password')
//     .notEmpty().withMessage('Conform Password is required')
//     .custom((value, { req }) => {
//         if (value !== req.body.password) {
//           throw new Error('Passwords do not match');
//         }
//         return true;
//       }),
//       body('email')
//       .notEmpty().withMessage('Email is required')
//       .isEmail().withMessage('Invalid email address')
// ];
  
//   const validate=(req,res,next)=>{
//     const error=validationResult(req)
