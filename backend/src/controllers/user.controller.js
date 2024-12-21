import AsyncHandler from "../utils/AsyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import { User } from "../models/user.models.js";

const registerUser = AsyncHandler( async (req,res)=>{

    // Get user info from FrontEnd
    // Validation
    // images indo
    // image indel Upload to Cloudinary
    // nammal indakkiye user object ind user.models.js athine create cheyya 
    // user create aayonn check cheyya aayenkil responsil ninn passwordum refreshtokenum kalaya
    // return response

    const {userName,password,email,fullName}=req.body
    
    if (!userName || !password || !email || !fullName) {
        throw new ApiError(400,"All fields are Required")
    }

    
    let profilePicture=null;
    if (req.files && Array.isArray(req.files.profilePicture) && (req.files.profilePicture.length > 0)){
        const profilePictureLocalPath = req.files?.profilePicture[0]?.path
        try {
            profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
        } catch (err) {
            throw new ApiError(500, "Error uploading profile picture");
        }
    }
    
    const user = await User.create({
        fullName,
        userName : userName.toLowerCase(),
        email,
        password,
        profilePicture : profilePicture?.url || ""
    })

    const createdUser = await User.findById(user.id).select(
        "-password -refreshToken"
    )
    if (!createdUser){
        throw new ApiError(500,"Some Problem With Creating User")
    }
    

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Created Succesfully")
    )
})

export {registerUser}