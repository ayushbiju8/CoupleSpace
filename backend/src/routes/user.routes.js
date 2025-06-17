import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, getUserHomePage, editUserProfile, getUserProfile } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/login").post(
    loginUser
)

router.route("/register").post(
    upload.fields([
        {
            name: "profilePicture",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/logout").post(
    verifyJWT,
    logoutUser
)

router.route("/current-user").get(
    verifyJWT,
    getCurrentUser
)

router.route("/user-homepage").get(
    verifyJWT,
    getUserHomePage
)

router.route("/edit-profile").put(
    verifyJWT,
    upload.fields([
        { name: "profilePicture", maxCount: 1 }
    ]),
    editUserProfile
);

router.route("/fetch-profile").get(
    verifyJWT,
    getUserProfile
)

export default router