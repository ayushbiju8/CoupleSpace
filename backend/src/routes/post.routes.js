import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllPosts,getPostById,deletePost,postAPost,likePost,unlikePost,addComment,deleteComment } from "../controllers/post.controller.js";

const router = Router()

router.route("/create").post(
    verifyJWT,
    upload.fields([{ name: "image", maxCount: 1 }]),
    postAPost
);

router.route("/").get(
    getAllPosts
);

router.route("/:postId").get(
    getPostById
);

router.route("/:postId").delete(
    verifyJWT,
    deletePost
);

router.route("/:postId/like").post(
    verifyJWT, 
    likePost
);
router.route("/:postId/unlike").post(
    verifyJWT, 
    unlikePost
);

router.route("/:postId/comment").post(
    verifyJWT,
    addComment
);

router.route("/:postId/comment/:commentId").delete(
    verifyJWT, 
    deleteComment
);

export default router