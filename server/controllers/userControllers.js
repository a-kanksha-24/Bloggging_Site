const bcrypt=require('bcrypt');
const User=require('../models/userModel')
const jwt=require('jsonwebtoken');
const fs=require('fs')
const path=require('path');
const {v4:uuid} =require("uuid");

const registerUser= async (req,res,next)=>{
    try{
        const{name,email,password,password2}=req.body;

        if(!name||!email||!password){
            return res.status(422).json({error:'fill all fields'})
        }
        const newEmail=email.toLowerCase()
        const emailExists=await User.findOne({email:newEmail})
        if(emailExists){
            return res.status(422).json({error:'email exists'})
        }

        if(password.trim().length < 6){
            return res.status(422).json({error:'password should be at least 6 characters'})
        }

        if(password!=password2){
            return res.status(422).json({error:'password do not match'})
        }

        const salt=await bcrypt.genSalt(10)
        const hashedPass= await bcrypt.hash(password,salt);
        const newUser=await User.create({name,email,password:hashedPass});
        res.status(201).json(newUser)
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const loginUser=async (req,res,next)=>{
    try{
    const{email,password}=req.body;

    const newEmail=email.toLowerCase()
    const user=await User.findOne({email:newEmail})
    if(!user){
        return res.status(422).json({error:'invalid credentials'})
    }
    const comparePass= await bcrypt.compare(password,user.password)
    if(!comparePass){
        return res.status(422).json({error:'password invalid'})
    }

    const {_id: id, name}=user;
    const token = jwt.sign({id,name},process.env.JWT_SECRET, {expiresIn: "1d"})

    res.status(200).json({token,id,name});
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getUser=async (req,res,next)=>{
    try{
        const {id} = req.params;
        const user = await User.findById(id).select('-password');
        if(!user){
            return res.status(422).json({error: "user not found"});
        }
        res.status(200).json(user);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const changeAvatar=async (req,res,next)=>{
    try{
        if(!req.files.avatar){
            return res.status(404).json({error: "please choose image"})
        }
        
        const user=await User.findById(req.user.id);
        if(user.avatar){
            fs.unlink(path.join(__dirname,'..','uploads', user.avatar),(err)=>{
                if(err)
                {
                    return res.status(404).json({error:"error"})
                }
            })
        }
        const {avatar}=req.files;
        if(avatar.size>500000){
            return res.status(404).json({error:"picture too big"})
        }
        let fileName
        fileName=avatar.name
        let splittedFileName=fileName.split('.')
        let newFileName= splittedFileName[0]+uuid()+'.'+splittedFileName[splittedFileName.length-1]
        avatar.mv(path.join(__dirname,'..','uploads',newFileName),async (err)=>{
            if(err){
                return res.status(404).json({error:"error"})
            }
            const updatedAvatar= await User.findByIdAndUpdate(req.user.id,{avatar:newFileName},{new:true})
            if(!updatedAvatar){
                return res.status(404).json({error:"avatar couldnt be chnaged"})
            }
            res.status(200).json(updatedAvatar);
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const editUser=async (req,res,next)=>{
    try{
        const {name, email, currentPassword, newPassword, confirmNewPassword}=req.body;
        if(!name||!email||!currentPassword||!newPassword){
            return res.status(403).json({ error: 'Fill all details' });
        }
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(403).json({ error: 'User not found' });
        }

        const emailExist=await User.findOne({email});

        // if(emailExist&&(emailExist.__id=req.user.id)){
        //     return res.status(403).json({ error: 'User already exists' });
        // }

        const validateUserPassword=await bcrypt.compare(currentPassword, user.password);
        if(!validateUserPassword){
            return res.status(422).json({ error: 'Incorrect Passsword' });
        }

        if(newPassword!==confirmNewPassword){
            return res.status(422).json({ error: 'Passwords do not match' });
        }

        const salt=await bcrypt.genSalt(10)
        const hash= await bcrypt.hash(newPassword,salt);

        const newInfo= await User.findByIdAndUpdate(req.user.id, {name,email,password: hash}, {new : true});
        res.status(200).json(newInfo);
    }
    catch(err){
        return res.status(500).json({ error: 'Server Error' });
    }
}

const getAuthors=async (req,res,next)=>{
    try{
        const authors = await User.find().select('-password');
        res.json(authors);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
} 

module.exports={registerUser,loginUser,getAuthors,getUser,changeAvatar,editUser}