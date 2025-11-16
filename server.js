import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'

const app = express()

import { v2 as cloudinary } from 'cloudinary';
// Configuration
    cloudinary.config({ 
        cloud_name: 'dwxjx7cfo', 
        api_key: '134151443136128', 
        api_secret: 'zExaPui1_E48mfQRqenra8ntYCY' // Click 'View API Keys' above to copy your API secret
    });

mongoose.connect("mongodb+srv://abhishekkumarsingh845454:U9nyWjUhtpake4xy@cluster0.dazf2fq.mongodb.net/", {
  dbName: "NodeJs_Course"
}).then(()=> console.log ("MongoDb Connected Succefully...!")).catch((err)=>console.log(err))

//Rendering ejs file
app.get('/', (req,res)=>{
  res.render('index.ejs',{url:null})
})


const storage = multer.diskStorage({
  // destination: './public/uploads' ,
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

const imageSchema = new mongoose.Schema({
  filename: String,
  public_id: String,
  imgUrl: String
})

const file = mongoose.model("cloudinary",imageSchema)

app.post('/upload', upload.single('file'), async (req, res) =>{
  const filePath =req.file.path

  const cloudinaryRes= await cloudinary.uploader.upload(filePath,{
    folder:"NodeJS_Mastery"
  })

  //Save to database
  const db = await file.create({
    filename: req.file.originalname,
    public_id: cloudinaryRes.public_id,
    imgUrl: cloudinaryRes.secure_url,
  })

  res.render("index.ejs", {url:cloudinaryRes.secure_url})

  // res.json({message: 'File Uploaded Successfully',cloudinaryRes})


  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})

const port = 4000;
app.listen(port,()=>console.log(`Server is running on port ${port}`))