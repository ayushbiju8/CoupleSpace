import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessages,getChatCoupleData } from "../controllers/chat.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()


router.route("/usersChat").get(
    verifyJWT,
    getUsersForSidebar
)
router.route("/coupleChat").get(
    verifyJWT,
    getChatCoupleData
)
router.route("/").get(
    verifyJWT,
    getMessages
)
router.route("/send/:id").post(
    verifyJWT,
    upload.fields([
        {
            name:"image",
            maxCount:1
        }
    ]),
    sendMessages
)

export default router