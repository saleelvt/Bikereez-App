const jwt = require('jsonwebtoken')

require('dotenv').config()

module.exports = {
    userTokenAuth: async (req, res, next) => {
        const token = req.cookies.userJwt
        // if(req.session.user === undefined) {
        //     const error = req.flash('Please Login or Signup');
        //     console.log('hay anuruth');

        //  return  res.render('./user/')
        
       
        if (token) {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    console.log('token not working ');
                    res.redirect("/signup")
                }
                console.log(user, 'hellooooo')
                req.session.userId = user?.user

                next()
            })
        } else {
            req.session.user = false
            const error = req.flash('Please Login or Signup');
            res.render("user/signup", { err: error, user: '' });
        }
        // }



    },

    userExist: (req, res, next) => {
        const token = req.cookies.userJwt;
        if (token) {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {

                    req.session.userId = user._id
                    next();
                }
                else {
                    res.redirect('/homepage')
                }
            })
        }
        else {
            next();
        }
    },
}