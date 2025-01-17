import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Couple,WishlistItem } from "../models/couple.models.js"
import { User } from "../models/user.models.js"
import { Invitation } from "../models/invitation.models.js";
import sendEmailInvite from "../utils/SendEmail.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import jwt from "jsonwebtoken"


const createCoupleSpace = AsyncHandler(async (req, res) => {


    const { coupleName, partnerTwoEmail } = req.body
    const userId = req.user._id

    if (!coupleName || !partnerTwoEmail) {
        throw new ApiError(400, "Couple name and partner email are required");
    }

    if (!userId) {
        throw new ApiError(401, "Invalid User(No user ID)")
    }

    const existingCoupleSpace = await Couple.findOne({
        $or: [
            { partnerOne: userId },
            { partnerTwo: userId },
        ],
    });

    // Check if the existing couple space has a partnerTwo. If it does, prevent the user from creating another couple space.
    if (existingCoupleSpace && existingCoupleSpace.partnerTwo) {
        throw new ApiError(400, "User already belongs to a complete couple space");
    }


    // const pendingInvitation = await Invitation.findOne({
    //     senderId: userId,
    //     status: 'pending',
    // });

    // if (pendingInvitation) {
    //     throw new ApiError(400, "You have a pending invitation. You cannot create a new couple space until it is accepted or rejected.");
    // }

    let coverPhoto = null;
    if (req.files && Array.isArray(req.files.coverPhoto) && (req.files.coverPhoto.length > 0)) {
        const coverPhotoLocalPath = req.files?.coverPhoto[0]?.path
        try {
            coverPhoto = await uploadOnCloudinary(coverPhotoLocalPath);
        } catch (err) {
            throw new ApiError(500, "Error uploading profile picture");
        }
    }

    const newCouple = await Couple.create({
        coupleName,
        partnerOne: userId,
        coverPhoto: coverPhoto?.url || "",
        partnerTwo: null,
    })

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { coupleId: newCouple._id },
        { new: true }
    );

    try {
        await sendEmailInvite(userId, partnerTwoEmail, newCouple._id);
    } catch (error) {
        throw new ApiError(500, "Error sending invitation email");
    }

    return res.status(200).json(
        new ApiResponse(200, newCouple, "Couple space created successfully. Invitation sent to partner 2.")
    );
})


const acceptInvitation = AsyncHandler(async (req, res) => {

    const { token } = req.body

    if (!token) {
        throw new ApiError(400, "Invitation token is Required")
    }

    try {
        const { senderId, receiverEmail, coupleId } = jwt.verify(
            token,
            process.env.INVITE_TOKEN_SECRET
        )

        const invitation = await Invitation.findOne({
            senderId,
            receiverEmail,
            coupleId
        })

        if (!invitation) {
            throw new ApiError(404, "Inviatation Not Found or Expired")
        }

        const user = await User.findOne({
            email: receiverEmail
        })

        if (!user) {
            throw new ApiError(404, "User with this Email Doesnt Exist")
        }

        const coupleSpace = await Couple.findById(coupleId)

        if (!coupleSpace) {
            throw new ApiError(404, "Couple space not found.");
        }

        if (coupleSpace.partnerTwo) {
            throw new ApiError(400, "This couple space already has a second partner.");
        }

        coupleSpace.partnerTwo = user._id;
        await coupleSpace.save()

        user.coupleId = coupleId
        await user.save()

        await Invitation.findByIdAndDelete(invitation._id)


        return res.status(200).json(
            new ApiResponse(200, {}, "Invitation accepted successfully!")
        )
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            throw new ApiError(401, "Invalid or expired token.");
        }
        throw new ApiError(500, error.message || "Error accepting the invitation.");
    }

})


const getCoupleSpace = AsyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(401, "Un-authorized Access");
    }

    // Using aggregate pipeline to join both partners and get full couple data
    const coupleSpace = await Couple.aggregate([
        {
            $match: {
                $or: [
                    { partnerOne: userId },
                    { partnerTwo: userId },
                ],
            },
        },
        {
            $lookup: {
                from: 'users', // Ensure this matches your User model collection name
                localField: 'partnerOne',
                foreignField: '_id',
                as: 'partnerOneDetails',
            },
        },
        {
            $lookup: {
                from: 'users', // Ensure this matches your User model collection name
                localField: 'partnerTwo',
                foreignField: '_id',
                as: 'partnerTwoDetails',
            },
        },
        {
            $project: {
                coupleName: 1,
                coverPhoto: 1,
                wishlist: 1,
                achievements: 1,
                calendar: 1,
                roadmap: 1,
                memories: 1,
                partnerOneName: { $arrayElemAt: ['$partnerOneDetails.fullName', 0] },
                partnerTwoName: { $arrayElemAt: ['$partnerTwoDetails.fullName', 0] },
                partnerOneProfilePicture: { $arrayElemAt: ['$partnerOneDetails.profilePicture', 0] },
                partnerTwoProfilePicture: { $arrayElemAt: ['$partnerTwoDetails.profilePicture', 0] },
            },
        },
    ]);

    if (!coupleSpace || coupleSpace.length === 0) {
        throw new ApiError(404, "Couple space not found");
    }

    return res.status(200).json(
        new ApiResponse(200, coupleSpace[0], "Couple space fetched successfully")
    );
});



const setOrUpdateCoupleProfile = AsyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const coverPhotoLocalPath = req.files?.coverPhoto[0]?.path;
        console.log(coverPhotoLocalPath);
        if (!coverPhotoLocalPath) {
            throw new ApiError(404, "Photo is Required")
        }
        console.log(coverPhotoLocalPath);
        const coverPhoto = await uploadOnCloudinary(coverPhotoLocalPath)

        if (!coverPhoto.url) {
            throw new ApiError(500, "Error while uploading Cover Photo")
        }

        // console.log(coverPhoto.url);
        // console.log(userId);
        const couple = await Couple.findOneAndUpdate(
            { $or: [{ partnerOne: userId }, { partnerTwo: userId }] }, 
            {
                $set: { coverPhoto: coverPhoto.url }
            },
            { new: true }
        );
        // console.log(couple);
        return res.status(200).json(
            new ApiResponse(400, couple, "Photo Updated Succesfully")
        )
    } catch (error) {
        throw new ApiError(400, "Some error Occured")
    }

})

const addBucketList = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { item } = req.body;

    if (!item) {
        throw new ApiError(400, "Wishlist item is required.");
    }

    if (!userId) {
        throw new ApiError(401, "Unauthorized access.");
    }

    const couple = await Couple.findOne({
        $or: [{ partnerOne: userId }, { partnerTwo: userId }],
    });

    if (!couple) {
        throw new ApiError(404, "Couple space not found.");
    }

    const newWishlistItem = await WishlistItem.create({ item });

    couple.wishlist.push(newWishlistItem._id);
    await couple.save();

    return res.status(201).json(
        new ApiResponse(201, newWishlistItem, "Wishlist item added successfully.")
    );
});

const getBucketlist = AsyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Ensure the user is authorized and part of a couple space
    if (!userId) {
        throw new ApiError(401, "Unauthorized access");
    }

    // Find the couple space that the user belongs to
    const coupleSpace = await Couple.findOne({
        $or: [
            { partnerOne: userId },
            { partnerTwo: userId },
        ],
    });

    if (!coupleSpace) {
        throw new ApiError(404, "Couple space not found");
    }

    // Fetch all wishlist items associated with the couple space
    const wishlistItems = await WishlistItem.find({
        _id: { $in: coupleSpace.wishlist },
    });

    // Respond with the wishlist items
    return res.status(200).json(
        new ApiResponse(200, wishlistItems, "Wishlist fetched successfully")
    );
});

const editBucketlist = AsyncHandler(async (req, res) => {
    const { wishlistItemId, item, status } = req.body;

    // Validate input
    if (!wishlistItemId) {
        throw new ApiError(400, "Wishlist Item ID is required");
    }

    if (!item && !status) {
        throw new ApiError(400, "Either item or status must be provided for update");
    }

    // Find the wishlist item by ID
    const wishlistItem = await WishlistItem.findById(wishlistItemId);
    if (!wishlistItem) {
        throw new ApiError(404, "Wishlist item not found");
    }

    // Update the fields
    if (item) wishlistItem.item = item;
    if (status) wishlistItem.status = status;

    // Save the updated item
    await wishlistItem.save();

    // Return the updated wishlist item
    return res.status(200).json(new ApiResponse(200, wishlistItem, "Wishlist item updated successfully"));
});

const deleteBucketlist = AsyncHandler(async (req, res) => {
    const { wishlistItemId } = req.body;  // Assuming the ID is passed in the request body

    if (!wishlistItemId) {
        throw new ApiError(400, "Wishlist item ID is required");
    }

    // Find the wishlist item by its ID
    const wishlistItem = await WishlistItem.findById(wishlistItemId);

    if (!wishlistItem) {
        throw new ApiError(404, "Wishlist item not found");
    }

    // Delete the wishlist item
    await WishlistItem.findByIdAndDelete(wishlistItemId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Wishlist item deleted successfully")
    );
});


export {
    createCoupleSpace,
    acceptInvitation,
    getCoupleSpace,
    setOrUpdateCoupleProfile,
    addBucketList,
    getBucketlist,
    editBucketlist,
    deleteBucketlist
};