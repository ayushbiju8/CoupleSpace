import AsyncHandler from "../utils/AsyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import { User } from "../models/user.models.js";

const generateAccessAndRefereshToken = async (userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}


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

const loginUser = AsyncHandler( async (req,res)=>{
    
    // aadhyam data edukkka front endinnu (req.body)
    // email and password
    // find the user in the database
    // check password
    // create access and refresh tokens
    // send response and cookies

    const {email,password}=req.body

    if (!email) {
        throw ApiError(400,"Email is Required")
    }
    if (!password) {
        throw ApiError(400,"Password is Required")
    }

    const user = await User.findOne({email})

    if (!user) {
        throw new ApiError(404,"User doesnt Exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401,"Invalid user credentials")
    }

    const {accessToken,refreshToken}=await generateAccessAndRefereshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-refreshToken -password"
    )

    const options ={
        httpOnly : true,
        secure : true
    }


    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})

export {registerUser,loginUser}