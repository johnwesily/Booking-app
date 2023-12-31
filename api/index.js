const express=require("express");
const cors=require("cors");
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');
const User=require('./models/User.js')
const Place=require('./models/Place.js')
const cookieParser=require('cookie-parser');
const download=require('image-downloader');
const multer=require('multer');
const fs=require('fs');
const Booking=require('./models/Booking.js');
const { resolve } = require("path");
const { rejects } = require("assert");
require("dotenv").config();

 

const app=express();

const bcryptSalt=bcrypt.genSaltSync(10);
const jwtSecret="jaidflksdf4208jsklfmskd";

app.use(express.json());
app.use('/uploads',express.static(__dirname+'/uploads'))
app.use(cookieParser());

app.use(cors({
    credentials:true,
    origin:'https://airbnb-clinet.onrender.com',
}));

console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL)

function getUseDataFromReq(req){
    return new Promise((resolve,rejects)=>{
        jwt.verify(req.cookies.token,jwtSecret,{},async(err,userData)=>{
            if(err) throw err;
            resolve(userData);
       });
    })
}


app.get('/test',(req,res)=>{
    res.json("test ok");
})


app.post('/register',async (req,res)=>{
    const {name,email,password} =req.body;
 
    try{
      const userDoc =await User.create({
        name,
        email,
        password:bcrypt.hashSync(password,bcryptSalt),
    });
    res.json(userDoc);
   }
   catch(e){
    res.status(422).json(e);
   }

})



app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const userDoc = await User.findOne({ email });
  
      if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
  
        if (passOk) {
          jwt.sign(
            { email: userDoc.email, id: userDoc._id },
            jwtSecret,
            {},
            (err, token) => {
              if (err) {
                throw err; 
              }
              res.cookie('token', token, { sameSite: 'none', secure: true }).json(userDoc);
            }
          );
        } else {
          res.status(422).json("pass not ok");
        }
      } else {
        res.json('user not found');
      }
    } catch (error) {
     
      console.error("Error occurred during login:", error);
      res.status(500).json("An error occurred during login.");
    }
  });
  


app.get('/profile',(req,res)=>{
   const {token}=req.cookies;
   if(token){
     jwt.verify(token,jwtSecret,{},async(err,user)=>{
       if(err) throw err;
      const {name,email,_id}=await User.findById(user.id);
       res.json({name,email,_id});
     })
   }
   else{
    res.json(null);
   }

})


app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true);
})

console.log(__dirname)
app.post('/upload-by-link',async(req,res)=>{
    const{link}=req.body;
    const newName='photo'+Date.now()+'.jpg';
    await download.image({
        url:link,
        dest: __dirname+'/uploads/'+newName,
    });
res.json(newName);

}) 


const photoMiddleware=multer({dest:'uploads'});

app.post('/upload',photoMiddleware.array('photos',10),(req,res)=>{
    const  uploadedFiles=[];
  for(let i=0;i<req.files.length;i++){
    const {path, originalname}= req.files[i];
    const parts= originalname.split('.');
    const ext=parts[parts.length-1];
    const newPath=path+'.'+ext;
    fs.renameSync(path,newPath);
    uploadedFiles.push(newPath.replace('uploads/',''));

  }
   res.json(uploadedFiles);
});



app.post('/places',(req,res)=>{
    const {token}=req.cookies;
    const {title,address,photos,
        description,perks,extraInfo,
        checkIn,checkOut,maxGuests,price }=req.body;
     jwt.verify(token,jwtSecret,{},async(err,user)=>{
       if(err) throw err;
      const placeDoc=await Place.create({
        owner:user.id, 
        title,address,photos,
        description,perks,extraInfo,
        checkIn,checkOut,maxGuests,price
       });
       res.json(placeDoc) 
     });
   
});

app.get('/user-places',(req,res)=>{
    const{token}=req.cookies;
    jwt.verify(token,jwtSecret,{},async (err,userData)=>{
        const{id}=userData;
        res.json(await Place.find({owner:id}));
    })
})
 

app.get('/places/:id',async (req,res)=>{
    const {id}  =req.params;
    res.json(await Place.findById(id));
})

app.put('/places',async(req,res)=>{
    const{token}=req.cookies;
    const {id,title,address,photos,
        description,perks,extraInfo,
        checkIn,checkOut,maxGuests,price }=req.body;
    
    jwt.verify(token,jwtSecret,{},async(err,userData)=>{
        if(err) throw err;
        const placeDoc=await Place.findById(id);
        if(userData.id === placeDoc.owner.toString()){
            placeDoc.set({
                title,address,photos,
                description,perks,extraInfo,
                checkIn,checkOut,maxGuests,price
               }); 
            await placeDoc.save();
            res.json('ok');
        }
    })
})


app.get("/places",async (req,res)=>{
    res.json(await Place.find());
})


app.post('/bookings',async (req,res)=>{
    const userData=await getUseDataFromReq(req);
    const {
        place,checkIn,checkOut,numberOfGuest,phone,price,name
        }=req.body;

        Booking.create({
            place,checkIn,checkOut,numberOfGuest,phone,price,name,
            user:userData.id,
        }).then((doc)=>{
            res.json(doc);
        }).catch((err)=>{
            throw err;
        })
})



app.get('/bookings',async (req,res)=>{
    try {
     const userData=await getUseDataFromReq(req);
    res.json(await Booking.find({user:userData.id}).populate('place'));
     
    } catch (error) {
     res.json(error);
    }
    
 })

  


app.listen(4000,()=>{
    console.log("don't worry server is listing to port 4000");
}
)