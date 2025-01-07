import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createCoupleSpace ,acceptInvitation ,getCoupleSpace ,setOrUpdateCoupleProfile} from "../controllers/couple.controller.js"

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

export default router