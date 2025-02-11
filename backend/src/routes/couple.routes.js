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
    deleteCalendarEvent
} from "../controllers/couple.controller.js"

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



export default router