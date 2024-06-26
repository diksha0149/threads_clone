import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import {v2 as cloudinary} from "cloudinary"

const createPost = async(req,res)=>{

    try {
        
        const {postedBy, text} = req.body;
        let {img} = req.body;
        if(!postedBy || !text){
            return res.status(400).json({error: "PostedBy and text are required fields"});
        }

        const user = await User.findById(postedBy)
        if(!user){
            return res.status(404).json({error: "user not found"});
        }

        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({error:"not authorized to create POST"});
        }
        const maxlength = 500;
        if(text.length > maxlength){
            return res.status(404).json({error: `text must be less than ${maxlength}`});
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url
        }

        const newPost = new Post({postedBy,text,img});

        await newPost.save()
        res.status(201).json( newPost);

    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in createPost", error.message);
    }
}

const getPost = async(req,res)=>{

    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({error: "Post does not exist"});
            console.log("User doesnot exist");
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in getPost",error.message);
    }
}

const deletePost = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({error: "Post not found"});
        }
        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(400).json({error: "Unauthorized to delete Post"});
        }
        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Post deleted Successfully"});

    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in delete Post",error.message);
    }
}

const likeUnlikePost = async(req,res)=>{
    try {

        const {id:postId} = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(400).json({error: "Post not found"});
        }

        // checks if an likes array ciontains the userId or not
        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost){
            // unlike post
            await Post.updateOne({_id:postId},{$pull: {likes:userId}})
            res.status(200).json({message: "Post unliked Successfully"})
        }
        else{
            //like post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({message: "Post Likes successfully"});
        }

        
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in lineUnlikePost", error.message);
    }
} 
const replyToPost = async(req,res)=>{

    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.userProfilePic;
        const username = req.user.username;

        if(!text){
            res.status(404).json({error: "Text feild is required"});
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }

        const reply = {userId, text, userProfilePic, username};

        post.replied.push(reply);
        await post.save();

        res.status(200).json(reply);

    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in Comment repltToPost",error.message)
    }
}

const getFeedPosts = async(req,res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        const following = user.following;

        const feedPosts = await Post.find({postedBy:{$in: following}}).sort({createdAt: -1});

        res.status(200).json(feedPosts);
        
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in feed", error.message);
    }
}

const getUserPost = async(req,res)=>{
    const {username} = req.params;
    try {
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({error: "User Not found"});
        }
        
        const posts = await Post.find({postedBy: user._id}).sort({createdAt:-1}); // sort in descending order latest post comes first;

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({message: error.message})
        console.log("Error in getUserPost",error.message);
    }
}

export {createPost,getPost, deletePost,likeUnlikePost,replyToPost,getFeedPosts,getUserPost} 