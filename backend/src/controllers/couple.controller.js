import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Couple, WishlistItem, CalendarTask, Achievement, Roadmap } from "../models/couple.models.js"
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
    const userId = req.user?._id;
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
// Calendar

const addCalendarEvent = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { title, description, date, startTime, endTime } = req.body;

    if (!title || !date || !startTime || !endTime) {
        throw new ApiError(400, "Title, date, start time, and end time are required.");
    }

    const couple = await Couple.findOne({
        $or: [{ partnerOne: userId }, { partnerTwo: userId }],
    });

    if (!couple) {
        throw new ApiError(404, "Couple space not found.");
    }

    const newEvent = await CalendarTask.create({
        title,
        description,
        date,
        startTime,
        endTime,
    });

    couple.calendar.push(newEvent._id);
    await couple.save();

    return res.status(201).json(
        new ApiResponse(201, newEvent, "Calendar event added successfully.")
    );
});

const getCalendarEvents = AsyncHandler(async (req, res) => {
    const userId = req.user._id;

    const couple = await Couple.findOne({
        $or: [{ partnerOne: userId }, { partnerTwo: userId }],
    });

    if (!couple) {
        throw new ApiError(404, "Couple space not found.");
    }

    const events = await CalendarTask.find({
        _id: { $in: couple.calendar },
    });

    return res.status(200).json(
        new ApiResponse(200, events, "Calendar events fetched successfully.")
    );
});

const editCalendarEvent = AsyncHandler(async (req, res) => {
    const { eventId, title, description, date, startTime, endTime } = req.body;

    if (!eventId) {
        throw new ApiError(400, "Event ID is required.");
    }

    const event = await CalendarTask.findById(eventId);

    if (!event) {
        throw new ApiError(404, "Event not found.");
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (startTime) event.startTime = startTime;
    if (endTime) event.endTime = endTime;

    await event.save();

    return res.status(200).json(
        new ApiResponse(200, event, "Calendar event updated successfully.")
    );
});

const deleteCalendarEvent = AsyncHandler(async (req, res) => {
    const { eventId } = req.body;

    if (!eventId) {
        throw new ApiError(400, "Event ID is required.");
    }

    const event = await CalendarTask.findById(eventId);

    if (!event) {
        throw new ApiError(404, "Event not found.");
    }

    await CalendarTask.findByIdAndDelete(eventId);

    const couple = await Couple.findOne({
        $or: [{ partnerOne: req.user._id }, { partnerTwo: req.user._id }],
    });

    if (couple) {
        couple.calendar.pull(eventId);
        await couple.save();
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Calendar event deleted successfully.")
    );
});

const updateCupidScore = async (userId) => {
    try {
        const couple = await Couple.findOne({
            $or: [{ partnerOne: userId }, { partnerTwo: userId }]
        });

        if (!couple) return;

        let achievement = await Achievement.findOne({ coupleId: couple._id });
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day

        if (!achievement) {
            // First-time login tracking
            achievement = new Achievement({
                coupleId: couple._id,
                cupidScore: 0,
                partnerOneLastLogin: couple.partnerOne.equals(userId) ? today : null,
                partnerTwoLastLogin: couple.partnerTwo.equals(userId) ? today : null,
                daysTogether: 1,
            });
        } else {
            // Update login timestamp for the current user
            if (couple.partnerOne.equals(userId)) {
                achievement.partnerOneLastLogin = today;
            } else if (couple.partnerTwo.equals(userId)) {
                achievement.partnerTwoLastLogin = today;
            }

            // Get the last score update date, normalized to start of day
            const lastScoreUpdate = achievement.lastScoreUpdate
                ? new Date(achievement.lastScoreUpdate).setHours(0, 0, 0, 0)
                : null;

            // Check if both partners have logged in today
            const bothLoggedInToday =
                achievement.partnerOneLastLogin &&
                achievement.partnerTwoLastLogin &&
                new Date(achievement.partnerOneLastLogin).setHours(0, 0, 0, 0) === today.getTime() &&
                new Date(achievement.partnerTwoLastLogin).setHours(0, 0, 0, 0) === today.getTime();

            // Only update score if:
            // 1. Both partners logged in today
            // 2. Score hasn't been updated today yet
            if (bothLoggedInToday && lastScoreUpdate !== today.getTime()) {
                achievement.cupidScore += 1;
                achievement.lastScoreUpdate = today;
                console.log("Updating Cupid Score for today");
            }

            // Update days together
            const firstDay = new Date(couple.createdAt);
            achievement.daysTogether = Math.floor((today - firstDay) / (1000 * 60 * 60 * 24));
        }

        await achievement.save();
    } catch (error) {
        console.error("Error updating Cupid Score:", error);
    }
};

const uploadMemory = AsyncHandler(async (req, res) => {
    try {
        console.log("Request received:", req.body, req.files);
        const userId = req.user._id;
        const memoryPhotoLocalPath = req.files?.memoryPhoto?.[0]?.path;

        if (!memoryPhotoLocalPath) {
            throw new ApiError(400, "Memory Photo is required");
        }

        const memoryPhoto = await uploadOnCloudinary(memoryPhotoLocalPath);

        if (!memoryPhoto.url) {
            throw new ApiError(500, "Error uploading Memory Photo");
        }

        // Define memory object
        const newMemory = {
            url: memoryPhoto.url,
            fileType: "image", // Assuming all uploads are images for now
            uploadedAt: new Date()
        };

        // Find the couple and update their memories array
        const couple = await Couple.findOneAndUpdate(
            { $or: [{ partnerOne: userId }, { partnerTwo: userId }] },
            { $push: { memories: newMemory } }, // Push new memory into the array
            { new: true }
        );

        if (!couple) {
            throw new ApiError(404, "Couple space not found");
        }

        return res.status(200).json(
            new ApiResponse(200, couple, "Memory Uploaded Successfully and added to Couple Space")
        );
    } catch (error) {
        console.error("Upload Memory Error:", error);
        throw new ApiError(500, error.message || "Some error occurred");
    }
});

const getMemories = AsyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        // Find the couple document
        const couple = await Couple.findOne({
            $or: [{ partnerOne: userId }, { partnerTwo: userId }]
        });

        if (!couple) {
            throw new ApiError(404, "Couple space not found");
        }

        // Check if there are any memories
        if (!couple.memories || couple.memories.length === 0) {
            return res.status(200).json(
                new ApiResponse(200, [], "No memories found")
            );
        }

        // Sort memories by uploadedAt in descending order (newest first)
        const sortedMemories = couple.memories.sort((a, b) =>
            new Date(b.uploadedAt) - new Date(a.uploadedAt)
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                sortedMemories,
                "Memories retrieved successfully"
            )
        );
    } catch (error) {
        console.error("Get Memories Error:", error);
        throw new ApiError(500, error.message || "Error fetching memories");
    }
});


const addRoadMap = AsyncHandler(async (req, res) => {

    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(400, "Unauthorized Access")
    }

    const { heading, description } = req.body
    if (!heading) {
        throw new ApiError(400, "Heading is required")
    }
    if (!description) {
        throw new ApiError(400, "Description is required")
    }

    const imageItem = req.files?.image[0]?.path

    if (!imageItem) {
        throw new ApiError(400, "Image is required")
    }

    const image = await uploadOnCloudinary(imageItem)

    if (!image?.url) {
        throw new ApiError(400, "Image uploading failed.")
    }



    const couple = await Couple.findOne({
        $or: [{ partnerOne: userId }, { partnerTwo: userId }],
    });

    if (!couple) {
        throw new ApiError(404, "Couple Space Doesnt Exist")
    }

    const roadmapItem = await Roadmap.create({
        heading,
        description,
        image: image?.url,
    })

    couple.roadmap.push(roadmapItem._id)
    await couple.save()


    return res.status(200).json(
        new ApiResponse(200, {}, "Roadmap Added Succesfully.")
    )
})

const getRoadMap = AsyncHandler(async (req, res) => {
    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(404, "User is not Authenticated")
    }

    const couple = await Couple.findOne({
        $or: [{ partnerOne: userId }, { partnerTwo: userId }]
    })

    if (!couple) {
        throw new ApiError("Couple Space doesnt Exist")
    }

    const roadmaps = await Roadmap.find({
        _id: { $in: couple.roadmap }
    })

    return res.status(200).json(
        new ApiResponse(200, roadmaps, "Roadmap Fetched Succesfully")
    )
})

const deleteRoadMap = AsyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { roadmapId } = req.body;

    console.log("Received request body:", req.body);

    if (!userId) {
        throw new ApiError(401, "Unauthorized Access");
    }

    if (!roadmapId) {
        throw new ApiError(400, "Roadmap ID is required");
    }

    const couple = await Couple.findOne({
        $or: [{ partnerOne: userId }, { partnerTwo: userId }],
    });

    if (!couple) {
        throw new ApiError(404, "Couple Space Doesn't Exist");
    }

    // Convert roadmapId to string for comparison
    const roadmapExists = couple.roadmap.some(id => id.toString() === roadmapId.toString());
    
    if (!roadmapExists) {
        throw new ApiError(403, "Unauthorized to delete this roadmap");
    }

    // Verify the roadmap exists before trying to delete
    const existingRoadmap = await Roadmap.findById(roadmapId);
    if (!existingRoadmap) {
        throw new ApiError(404, "Roadmap not found");
    }

    await Roadmap.findByIdAndDelete(roadmapId);

    // Update the couple's roadmap array
    couple.roadmap = couple.roadmap.filter(id => id.toString() !== roadmapId.toString());
    await couple.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Roadmap Deleted Successfully.")
    );
});

const updateRoadMap = AsyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { roadmapId, heading, description } = req.body;

    if (!userId) {
        throw new ApiError(401, "Unauthorized Access");
    }

    console.log("Request Body:", req.body);


    const couple = await Couple.findOne({
        $or: [{ partnerOne: userId }, { partnerTwo: userId }],
    });

    if (!couple) {
        throw new ApiError(404, "Couple Space Doesn't Exist");
    }
    console.log("Couple's roadmap IDs:", couple.roadmap);
    console.log("Checking for roadmapId:", roadmapId);


    if (!couple.roadmap.includes(roadmapId)) {
        throw new ApiError(403, "Unauthorized to update this roadmap");
    }

    let image;
    if (req.files?.image) {
        const imageItem = req.files.image[0]?.path;
        image = await uploadOnCloudinary(imageItem);
        if (!image?.url) {
            throw new ApiError(400, "Image uploading failed.");
        }
    }

    const updatedRoadmap = await Roadmap.findByIdAndUpdate(
        roadmapId,
        {
            heading,
            description,
            ...(image?.url && { image: image.url })
        },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedRoadmap, "Roadmap Updated Successfully.")
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
    deleteBucketlist,
    addCalendarEvent,
    getCalendarEvents,
    editCalendarEvent,
    deleteCalendarEvent,
    updateCupidScore,
    uploadMemory,
    getMemories,
    addRoadMap,
    getRoadMap,
    updateRoadMap,
    deleteRoadMap
};