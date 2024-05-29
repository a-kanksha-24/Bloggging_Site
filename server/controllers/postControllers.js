const HttpError = require("../models/errorModel");
const Post = require('../models/postModel')
const User = require('../models/userModel')
const path = require('path')
const fs = require('fs')
const {v4: uuid} = require('uuid');

const createPost=async (req,res,next)=>{
    try{
        let {title, category, description} = req.body;
        if(!title || !category || !description || !req.files){
            return res.status(422).json({error: "fill in all fields"})
        }

        const {thumbnail} = req.files;

        if(thumbnail.size>2000000){
            return res.status(422).json({error: "thumbnail too big. Enter file leass than 2mb"})
        }
        let fileNamw= thumbnail.name;
        let splittedFilename=fileNamw.split('.')
        let newFilename= splittedFilename[0]+uuid()+"."+splittedFilename[splittedFilename.length-1]
        
        thumbnail.mv(path.join(__dirname, '..' , '/uploads', newFilename), async (err)=>{
            if(err){
                return next(new HttpError(err))
            }
            else{
                const newPost= await Post.create({title, category, description, thumbnail: newFilename, creator: req.user.id})
                if(!newPost){
                    return res.status(422).json({error: "post couldn't created"})
                }
                const currentUser= await User.findById(req.user.id);
                const userPostCount=currentUser.posts+1;
                await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})

                res.status(201).json(newPost)
            }
        })
    }
    catch(err){
        return next( new HttpError(err))
    }
}

const getPosts=async (req,res,next)=>{
    try{
        const posts = await Post.find().sort({updateAt: -1})
        res.status(200).json(posts)
    }
    catch(err){
        return next (new HttpError(err))
    }
}

const getPost=async (req,res,next)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error:"post not found"})
        }
        res.status(200).json(post)
    }
    catch(err){
        return next (new HttpError(err))
    }
}

const getCatPosts=async (req,res,next)=>{
    try{
        const {category} = req.params;
        const catPosts = await Post.find({category}).sort({createdAt: -1});
        res.status(201).json(catPosts)
    }
    catch(err){
        return next (new HttpError(err))
    }
}

const getUserPosts=async (req,res,next)=>{
    try{
        const {id} = req.params;
        const posts = await Post.find({creator: id}).sort({createdAt: -1});
        res.status(201).json(posts)
    }
    catch(err){
        return next (new HttpError(err))
    }
}

const editPost=async (req,res,next)=>{
    try{
        let fileName;
        let newFileName;
        let updatedPost;
        const postId = req.params.id;
        let {title, category, description} = req.body;

        if(!title || !category || description.length<12){
            return res.status(422).json({error: "fill in all fields"})
        }
        if(!req.files){
            updatedPost= await Post.findByIdAndUpdate(postId, {title, category, description},{new: true});
        }
        else{
            const oldPost= await Post.findById(postId);

            fs.unlink(path.join(__dirname, '..' , 'uploads' , oldPost.thumbnail), async (err)=>{
                if(err){
                    return next(new HttpError(err))
                }
            })
            const {thumbnail}=req.files;
                if(thumbnail.size>2000000){
                    res.status(422).json({error: "thumbnail too big"})
                }
                fileName=thumbnail.name;
                let splittedFileName=fileName.split('.');
                newFileName= splittedFileName[0]+uuid()+"."+splittedFileName[splittedFileName.length-1]
                thumbnail.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err)=>{
                    if(err){
                        return next(new HttpError(err))
                    }
                })
                updatedPost=await Post.findByIdAndUpdate(postId, {title, category, description,thumbnail: newFileName},{new: true})
            }
            if(!updatedPost){
                return res.status(422).json({error: "error updating"})
            }
            res.status(200).json(updatedPost);
        }
    catch(err){
        return next (new HttpError(err))
    }
}

const deletePost=async (req,res,next)=>{
    try{
        const postId= req.params.id;
        if(!postId){
            return res.status(400).json({error: "post unavailable"})
        }
        const post = await Post.findById(postId);
        const fileName= post?.thumbnail;
        fs.unlink(path.join(__dirname, '..' , 'uploads', fileName), async(err)=>{
            if(err){
                return next(new HttpError(err))
            }
            else{
                await Post.findByIdAndDelete(postId);

                const currentUser= await User.findById(req.user.id)
                const userPostCount = currentUser?.posts - 1;
                await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})
            }
        })

        res.json(`Post ${postId} deleted successfully`);
    }
    catch(err)
    {
        return next(new HttpError(err))
    }
}

module.exports={createPost, getCatPosts, getPosts, getPost, getUserPosts, editPost, deletePost}
