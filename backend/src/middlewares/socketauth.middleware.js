import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { Couple } from "../models/couple.models.js"; // Import Couple model
import ApiError from "../utils/ApiError.js";

const verifyJWTForSocket = async (socket, next) => {
  try {
    const token =
      socket.handshake.headers.cookie
        ?.split("; ")
        .find(cookie => cookie.startsWith("accessToken="))
        ?.split("=")[1] || socket.handshake.auth?.token;

    if (!token) {
      return next(new ApiError(401, "Unauthorized Request (No Token Provided)"));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      return next(new ApiError(401, "Unauthorized Request (Error while decoding)"));
    }

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if (!user) {
      return next(new ApiError(401, "Invalid Access Token"));
    }

    // Fetch couple details based on the user
    const coupleSpace = await Couple.findOne({
      $or: [{ partnerOne: user._id }, { partnerTwo: user._id }],
    });

    if (!coupleSpace) {
      return next(new ApiError(404, "Couple not found"));
    }

    // Determine the other partner's ID
    const otherPartnerId =
      coupleSpace.partnerOne.toString() === user._id.toString()
        ? coupleSpace.partnerTwo
        : coupleSpace.partnerOne;

    // Fetch the partner's details (e.g., name, profile picture)
    const partner = await User.findById(otherPartnerId).select(
      "-password -refreshToken"
    );

    if (!partner) {
      return next(new ApiError(404, "Partner not found"));
    }

    // Add user and partner details to socket object
    socket.user = { ...user.toObject(), partner };

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error); // Log error message
    return next(new ApiError(400, `Error Verifying JWT: ${error.message}`));
  }
};

export { verifyJWTForSocket };
