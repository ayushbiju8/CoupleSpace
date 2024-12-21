import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
    api_key: process.env.CLOUDINARY_API_KEY , 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (loaclFilePath)=>{
    if (!loaclFilePath) {
        return null
    }
    try {
        const response = await cloudinary.uploader.upload(loaclFilePath,{
            resource_type:'auto'
        })
        fs.unlinkSync(loaclFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(loaclFilePath)
        console.error(`Some Error Occured while Uploading to Cloudinary : ${error}`);
    }
}

export {uploadOnCloudinary}