import express from 'express'
import { createPost, getPost, deletePost,likeUnlikePost,replyToPost,getFeedPosts,getUserPost} from "../controllers/postController.js"
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.get("/feed",protectRoute, getFeedPosts);
router.post("/create",protectRoute, createPost);
router.get("/:id",getPost); // get all the followers post
router.get("/user/:username",getUserPost); // get all the users post to view it on profile
router.delete("/:id",protectRoute,deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost)
router.put("/reply/:id", protectRoute, replyToPost);

export default router