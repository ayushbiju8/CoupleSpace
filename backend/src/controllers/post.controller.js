import { Post } from "../models/post.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";



const postAPost = AsyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized Access");
    }
    const { heading, content } = req.body
    if (!heading) {
        throw new ApiError(400, "Heading Required");
    }

    const imagePath = req.files?.image?.[0]?.path;
    let image = null
    if (imagePath) {
        image = await uploadOnCloudinary(imagePath);
    }
    const post = await Post.create({
        user: userId,
        heading,
        content: content || null,
        image: image ? image.url : ""
    })
    if (!post) {
        throw new ApiError(500, "Some Problem With Creating Post")
    }
    return res.status(200).json(
        new ApiResponse(200, post, "Post Created Succesfully")
    )
})
const getAllPosts = AsyncHandler(async (req, res) => {
    const posts = await Post.find()
        .populate("user", "fullName userName _id profilePicture")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

const getMyPosts = AsyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized Access");
    }

    const posts = await Post.find({ user: userId })
        .populate("user", "fullName userName _id profilePicture")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, posts, "User's posts fetched successfully"));
});


const getPostById = AsyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId)
        .populate("user", "fullName userName _id profilePicture")
        .populate("comments.user", "fullName userName _id profilePicture");


    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, post, "Post fetched successfully"));
});
const deletePost = AsyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user?._id;

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.user.toString() !== userId.toString()) {
        throw new ApiError(403, "Not authorized to delete this post");
    }

    await Post.findByIdAndDelete(postId);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Post deleted successfully"));
});



const likePost = AsyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Prevent duplicate likes
    if (post.likes.includes(userId)) {
        throw new ApiError(400, "You have already liked this post");
    }

    post.likes.push(userId);
    await post.save();

    return res.status(200).json(
        new ApiResponse(200, post, "Post liked successfully")
    );
});

const unlikePost = AsyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Check if user has liked it
    if (!post.likes.includes(userId)) {
        throw new ApiError(400, "You have not liked this post");
    }

    post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    await post.save();

    return res.status(200).json(
        new ApiResponse(200, post, "Post unliked successfully")
    );
});
const addComment = AsyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { postId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
        throw new ApiError(400, "Comment text is required");
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const newComment = {
        user: userId,
        text: text.trim(),
    };

    post.comments.push(newComment);
    await post.save();

    return res.status(200).json(
        new ApiResponse(200, post, "Comment added successfully")
    );
});
const deleteComment = AsyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const comment = post.comments.find(c => c._id.toString() === commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only delete your own comments");
    }

    post.comments = post.comments.filter(c => c._id.toString() !== commentId);
    await post.save();

    return res.status(200).json(
        new ApiResponse(200, post, "Comment deleted successfully")
    );
});


export {
    postAPost,
    getAllPosts,
    getPostById,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    deleteComment,
    getMyPosts
};
