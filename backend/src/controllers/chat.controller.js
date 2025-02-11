import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Chat } from "../models/chat.models.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { Couple } from "../models/couple.models.js";

const getUsersForSidebar = AsyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password -refreshToken")

        res.status(200).json(
            new ApiResponse(200, filteredUsers, "User Fetched Successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Unable to fetch Users")
    }
})

const getMessages = AsyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch all messages with sorting by newest first
        const messages = await Chat.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        })
        .sort({ createdAt: -1 }) // Sort messages by newest first
        .select("senderId receiverId text image createdAt") // Select only relevant fields
        .lean(); // Convert to plain JS objects for better performance

        res.status(200).json(
            new ApiResponse(200, messages, "Messages fetched successfully.")
        );
    } catch (error) {
        throw new ApiError(400, "Chat can't be fetched");
    }
});



const sendMessages = AsyncHandler(async (req, res) => {
    try {
        const { text } = req.body
        console.log("Request Body:", req.body); // Check for text
        console.log("Text:", text); // Check for text
        console.log("Request Params:", req.params); // Check for id
        console.log("User ID:", req.user?._id); // Check for req.user
        console.log("Uploaded Files:", req.files); // Check for image path
        const { id: receiverId } = req.params
        const userId = req.user._id
        let imageLocalPath
        if (req.files && req.files.image) {
            imageLocalPath = req.files?.image[0]?.path;
        }
        let image;
        if (imageLocalPath) {
            image = await uploadOnCloudinary(imageLocalPath)
        }
        const newChat = new Chat({
            senderId: userId,
            receiverId,
            text,
            image: image?.url
        })

        await newChat.save()

        // Socket.io implementation

        res.status(201).json(
            new ApiResponse(201, newChat, "Message has been sent succesfully")
        )
    } catch (error) {
        throw new ApiError(400, "Error while sending message")
    }
})

const getChatCoupleData = AsyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id;

        // Find the couple where the user is either partnerOne or partnerTwo
        const coupleSpace = await Couple.findOne({
            $or: [
                { partnerOne: userId },
                { partnerTwo: userId }
            ]
        });

        if (!coupleSpace) {
            throw new ApiError(404, "Couple not found");
        }

        // Determine the other partner's ID
        const otherPartnerId =
            coupleSpace.partnerOne.toString() === userId.toString()
                ? coupleSpace.partnerTwo
                : coupleSpace.partnerOne;

        // Fetch other partner's details from the User model
        const otherPartner = await User.findById(otherPartnerId).select(
            "fullName userName email profilePicture"
        );

        if (!otherPartner) {
            throw new ApiError(404, "Other partner not found");
        }

        res.status(200).json(
            new ApiResponse(200, otherPartner, "Other partner details fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Error fetching couple data or partner details");
    }
});

const uploadImageOnChat = AsyncHandler(async (req,res) => {
    // Take image from user.
    // Upload it
    // Handle error
    // Return the response url

    const imgLocalPath = req.files?.image[0]?.path;
    if (!imgLocalPath) {
        throw new ApiError(404,"Image not Found")
    }
    const image = await uploadOnCloudinary(imgLocalPath)
    if (!image) {
        throw new ApiError(400,"Image Failed to Upload on Cloudinary")
    }

    return res.status(200).json(
        new ApiResponse(200,{
            image :image.url
        },"Image SuccesFully Uploaded and Returned")
    )
})


export {
    getUsersForSidebar,
    getMessages,
    sendMessages,
    getChatCoupleData,
    uploadImageOnChat
}