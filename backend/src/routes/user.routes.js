import { Router } from "express";
import { registerUser,loginUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router()

router.route("/login").post(
    loginUser
)

router.route("/register").post(
    upload.fields([
        {
            name : "profilePicture",
            maxCount : 1
        }
    ]),
    registerUser
)

export default router