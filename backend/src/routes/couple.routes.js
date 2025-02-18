import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createCoupleSpace ,
    acceptInvitation ,
    getCoupleSpace ,
    setOrUpdateCoupleProfile,
    addBucketList,
    getBucketlist,
    editBucketlist,
    deleteBucketlist,
    addCalendarEvent,
    getCalendarEvents,
    editCalendarEvent,
    deleteCalendarEvent,
    uploadMemory,
    getMemories,
    addRoadMap,
    getRoadMap,
    updateRoadMap,
    deleteRoadMap
} from "../controllers/couple.controller.js"
import { Achievement } from "../models/couple.models.js";
import { Couple } from "../models/couple.models.js";


const router = Router()


router.route("/create-couple-space").post(
    verifyJWT,
    upload.fields([
        {
            name : "coverPhoto",
            maxCount : 1
        }
    ]),
    createCoupleSpace
)

router.route("/accept-invite").post(
    acceptInvitation
)

router.route("/couple-space").get(
    verifyJWT,
    getCoupleSpace
)

router.route("/update-coverphoto").post(
    verifyJWT,
    upload.fields([
        {
            name : "coverPhoto",
            maxCount : 1
        }
    ]),
    setOrUpdateCoupleProfile
)

router.route("/addWish").post(
    verifyJWT,
    addBucketList
)

router.route("/getWish").get(
    verifyJWT,
    getBucketlist
)

router.route("/editWish").put(
    verifyJWT,
    editBucketlist
)
router.route("/deleteWish").post(
    verifyJWT,
    deleteBucketlist
)














// Calendar Events
// Calendar Routes
router.route("/add-event").post(
    verifyJWT,
    addCalendarEvent
);

router.route("/get-events").get(
    verifyJWT,
    getCalendarEvents
);

router.route("/edit-event").put(
    verifyJWT,
    editCalendarEvent
);

router.route("/delete-event").post(
    verifyJWT,
    deleteCalendarEvent
);


router.get("/achievements", verifyJWT, async (req, res) => {
    try {
        // Extract user ID from the token
        const userId = req.user.id;

        // Find the couple where this user is a partner
        const couple = await Couple.findOne({
            $or: [{ partnerOne: userId }, { partnerTwo: userId }]
        });

        if (!couple) {
            return res.status(404).json({ message: "Couple space not found" });
        }

        // Fetch achievements using the couple ID
        const achievement = await Achievement.findOne({ coupleId: couple._id });

        if (!achievement) {
            return res.status(404).json({ message: "Achievements not found" });
        }

        res.status(200).json(achievement);
    } catch (error) {
        console.error("Error fetching achievements:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});

router.route("/uploadmemory").post(
    verifyJWT,
    upload.fields([
        {
            name : "memoryPhoto",
            maxCount : 1
        }
    ]),
    uploadMemory
)
router.route("/getmemory").get(
    verifyJWT,
    getMemories
)

router.route("/addroadmap").post(
    verifyJWT,
    upload.fields([
        {
            name: "image",
            maxCount : 1,
        }
    ]),
    addRoadMap
)
router.route("/getRoadmap").get(
    verifyJWT,
    getRoadMap
)
router.route("/updateRoadmap").put(
    verifyJWT,
    upload.fields([
        {
            name: "image",
            maxCount : 1,
        }
    ]),
    updateRoadMap
)
router.route("/deleteRoadmap").post(
    verifyJWT,
    deleteRoadMap
)


export default router