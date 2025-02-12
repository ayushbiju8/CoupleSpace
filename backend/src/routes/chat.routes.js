import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessages,getChatCoupleData,uploadImageOnChat } from "../controllers/chat.controller.js";
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
router.route("/imageUpload").post(
    verifyJWT,
    upload.fields([
        {
            name:"image",
            maxCount:1
        }
    ]),
    uploadImageOnChat
)




export default router