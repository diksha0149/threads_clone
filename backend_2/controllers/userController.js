import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import {v2 as cloudinary} from "cloudinary";
import mongoose from "mongoose";
import Post from "../models/postModel.js";



const signupUser = async(req,res)=>{
    try{
        const {name,email,username,password} = req.body;
        const user = await User.findOne({$or:[{email},{username}]});

        if(user){
            return res.status(400).json({error:"User already Exist"})
        }
        const salt =await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword
        })

        await newUser.save()

        if(newUser){
            generateTokenAndSetCookie(newUser._id,res);
            res.status(201).json({
                _id : newUser._id,
                name : newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic,
            })
        } else{
            res.status(400).json({error : "Invalid user data"});
        }

    }catch(error){
        res.status(500).json({message : error.message})
        console.log("Error in signupUser:",error.message)
    }
}

const loginUser = async(req,res)=>{

    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");

        if(!user || !isPasswordCorrect) return res.status(400).json({error: "Invalid Username or Password"});

        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic,
        });
    } catch (error) {
        res.status(500).json({message : error.message})
        console.log("Error in loginUser",error.message);   
    }
}

const logoutUser = async(req,res)=>{

    try {
        res.cookie("jwt","",{maxAge:1});
        res.status(200).json({message:"user Logged out Successfully"});
        
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in logout",error.message);
    }
}

const followUnfollowUser = async(req, res)=>{

    try {
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id===req.user._id.toString()) return res.status(400).json({error: "You can't follow unfollow yourself"});

        if(!userToModify || !currentUser) return res.status(400).json({error: "User not found"});

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            // unfollow user
            await User.findByIdAndUpdate(id,{$pull :{followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$pull: {following: id}});
            res.status(200).json({message: "User unFollowed Successfully"});
        }
        else{
            //  follow user
            await User.findByIdAndUpdate(id,{$push: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$push:{following: id}});
            res.status(200).json({message:"user followed successfully"});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in follow Unfollow User",error.message);
    }
}

const updateUser = async(req,res)=>{
    const {name, email,username,password, bio} = req.body;
    let {profilePic} = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if(!user) return res.status(400).json({error: "User not found"});

        if(req.params.id !== userId.toString()) return res.status(400).json({error: "You cannot update other users profile"});

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            user.password = hashedPassword
        }

        if(profilePic){
            // we will apply one more if check to delete the previously uploaded profile pic and to upload the new one // we just simply do replacing of previously image with the current one 
            if(user.profilePic){
                // deleting the old profile pic
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }
            // uploading the new profile pic
            const uploadedResponse = await cloudinary.uploader.upload(profilePic); // it will return an object
            profilePic = uploadedResponse.secure_url // secure_url will contain the url of profile image
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;    
        user.bio = bio || user.bio;

        user = await user.save()

        //  find all post that this user replied and update username and userProfilePic fields
        await Post.updateMany(
            {"replied.userId":userId}, // Filter: Updates documents where replied array contains an object with userId equal to userId
            {$set: {
                "replied.$[reply].username": user.username, // Update the username field in the replied array element that matches the filter
                "replied.$[reply].userProfilePic": user.profilePic // Update the userProfilePic field in the replied array element that matches the filter
            }},
            {arrayFilters: [{"reply.userId":userId}]} // Array filter: Specifies which elements in the replied array to update based on the filter
        )

        //password should be null in response

        user.password = null;
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in updatedProfile",error.message);
    }

}

const getUserProfile = async(req,res)=>{
    //  We will fetch user profile either with username or userId
    // query is either username or userId
    const {query}=req.params


    try {
        let user;
        // first we check whether query is valid userid or not
        // if query is userId
        if(mongoose.Types.ObjectId.isValid(query)){
            user = await User.findOne({_id:query}).select("-password").select("-updatedAt");
        }
        else{
            // query is username
            user = await User.findOne({username:query}).select("-password").select("-updatedAt");
        }

        if(!user){
           return res.status(500).json({error: "User doesn't exist"});
        }

        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in getUserProfile",error.message)
    }
}
export {signupUser, loginUser, logoutUser, followUnfollowUser, updateUser,getUserProfile}