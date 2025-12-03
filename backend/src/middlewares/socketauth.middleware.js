import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { Couple } from "../models/couple.models.js";
import ApiError from "../utils/ApiError.js";

const verifyJWTForSocket = async (socket, next) => {
  try {
    // 1) Try cookie: accessToken=<token>
    const cookieToken = socket.handshake.headers?.cookie
      ?.split("; ")
      .find((c) => c.startsWith("accessToken="))
      ?.split("=")[1];

    // 2) Try auth (client-side io({ auth: { token } }))
    const authToken = socket.handshake.auth?.token;

    // 3) Try Authorization header (extraHeaders: { Authorization: `Bearer ${token}` })
    const authHeader = socket.handshake.headers?.authorization;
    const headerToken = authHeader ? authHeader.split(" ")[1] : null;

    const token = cookieToken || authToken || headerToken;

    console.log("socket auth sources -> cookie:", !!cookieToken, "auth:", !!authToken, "header:", !!headerToken);

    if (!token) {
      return next(new ApiError(401, "Unauthorized: no token provided"));
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      console.error("JWT verify failed:", err);
      return next(new ApiError(401, "Unauthorized: invalid or expired token"));
    }

    if (!decodedToken || !decodedToken._id) {
      return next(new ApiError(401, "Unauthorized: invalid token payload"));
    }

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    if (!user) {
      return next(new ApiError(401, "Unauthorized: user not found"));
    }

    // Find couple that includes this user
    const coupleSpace = await Couple.findOne({
      $or: [{ partnerOne: user._id }, { partnerTwo: user._id }],
    });

    if (!coupleSpace) {
      return next(new ApiError(404, "Couple not found for this user"));
    }

    // Determine partner id and fetch partner
    const otherPartnerId =
      coupleSpace.partnerOne.toString() === user._id.toString()
        ? coupleSpace.partnerTwo
        : coupleSpace.partnerOne;

    const partner = await User.findById(otherPartnerId).select("-password -refreshToken");
    if (!partner) {
      return next(new ApiError(404, "Partner not found"));
    }

    // Attach user + partner to socket
    socket.user = { ...user.toObject(), partner };

    return next();
  } catch (error) {
    console.error("verifyJWTForSocket unexpected error:", error);
    return next(new ApiError(500, `Socket auth error: ${error.message}`));
  }
};

export { verifyJWTForSocket };
