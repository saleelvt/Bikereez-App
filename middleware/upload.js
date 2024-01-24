const multer=require('multer')
const path = require('path');
const storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'public/uploads')
    },
    filename:(req,file,callback)=>{
        // console.log(file);
        const uniqueSuffix= Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, uniqueSuffix + path.extname(file.originalname))
        
    }
})

const upload= multer({storage})
module.exports=upload
