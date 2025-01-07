import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
    api_key: process.env.CLOUDINARY_API_KEY , 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath)=>{
    // console.log(localFilePath);
    if (!localFilePath) {
        return null
    }
    try {
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        // console.log("R"+response.url);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); 
        }
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.error(`Some Error Occured while Uploading to Cloudinary : ${error}`);
    }
}

export {uploadOnCloudinary}