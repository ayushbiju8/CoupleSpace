import AsyncHandler from "../utils/AsyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

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
        throw new ApiError(400,"Email is Required")
    }
    if (!password) {
        throw new ApiError(400,"Password is Required")
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

const logoutUser = AsyncHandler( async (req,res)=>{
    // userinu oru input um nammak kittoola logout cheyyumbo so
    // nammal oru middleware design cheyynam to check access token

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },{new:true}
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
    };
    

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User Logged Out Succesfully")
    )
})


const refreshAccessToken = AsyncHandler( async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401,"Unauthorized Request(No refresh Token)")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401,"Invalid Refresh Token")
        }

        const {accessToken,newrefreshToken}=await generateAccessAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure : true
        }

        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(
            new ApiResponse(200,{
                accessToken,
                refreshToken: newrefreshToken
            },"Access Token Refreshed Successfully")
        )

    } catch (error) {
        new ApiError(401,error?.message||"Invalid refresh token(some error)")
    }
})

const getCurrentUser = AsyncHandler( async (req,res) => {
    return res.status(200).json(
        new ApiResponse(200,req.user,"Current User Fetched Succesfully")
    )
})

const getUserHomePage = AsyncHandler( async (req,res) => {

    // Things on Home Page
    // Username
    // Name
    // Is logged in or not
    // Profile Photo
    // Have Couple Space or not
    
    const user = await User.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup : {
                from : "couples",
                localField : "coupleId",
                foreignField : "_id",
                as : "couplespace"
            }
        },
        {
            $addFields : {
                haveCoupleSpace: { $gt: [ { $size: "$couplespace" }, 0 ] }
            }
        },
        {
            $project : {
                fullName : 1,
                userName : 1,
                profilePicture : 1,
                coupleId : 1,
                haveCoupleSpace : 1,
                coverPhoto: { $arrayElemAt: ["$couplespace.coverPhoto", 0] }
            }
        }
    ])

    if (!user?.length) {
        throw new ApiError(401,"User Cant be Found")
    }


    return res.status(200).json(
        new ApiResponse(200,user[0],"Homepage details fetched Successfully.")
    )
})

export {registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUser,getUserHomePage}