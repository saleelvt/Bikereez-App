
const express=require('express')
const app=express()
const path =require('path')
const userRouter=require('./routers/user')
const adminRouter=require('./routers/admin')
const flash=require('express-flash')
const cookieParser = require('cookie-parser');
const session=require('express-session')
const morgan=require('morgan')


const db=require('./config/db')
const { now } = require('mongoose')
const upload = require('./middleware/upload')
const adminController = require('./controllers/adminController')


require('dotenv').config()
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser());


app.use((req,res,next)=>{
  res.header('Cache-Control','private,store,no-cache,must-revalidate,max-age=0')
  next();
})


app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
  
  app.use(flash());

app.set('views',path.join( __dirname + '/views'));
app.set('view engine','ejs')



 app.use('/', userRouter);
 app.use('/admin',adminRouter);


 app.use("*", (req,res) => {

   res.render('error-page')
 })
 



 app.get("/upload",(req,res)=>{
 res.render('upload')
 })
 app.get("/upload",(req,res)=>{
 res.render('upload')
 })
 
 app.post('/upload',upload.single('saleel-image'),(req,res)=>{
     res.send('image uploaded bro its working')
 })





// its first nammal code run aakumbo cheyyunnath its a function 
  //  adminController.admin()
  //  .then(()=>{
  //   console.log('admin user created during application initialization');
  //   })
  //   .catch((error)=>{
  //       console.log('admin and user not created during initialization ',error );
  //   });



 const PORT = process.env.PORT || 9999
app.listen(PORT,()=>{
    console.log(`server run on http://localhost:${PORT}`);
})
