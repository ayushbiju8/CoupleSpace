import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { Invitation } from "../models/invitation.models.js";
import ApiError from "./ApiError.js";
import { User } from "../models/user.models.js";

const sendEmailInvite = async (senderId, receiverEmail, coupleId) => {
    try {
        // Fetch the sender's full name from the database
        const sender = await User.findById(senderId);
        if (!sender) {
            throw new ApiError(404, "Sender not found");
        }

        const senderName = sender.fullName; // Using fullName instead of senderId

        const token = jwt.sign(
            { senderId, receiverEmail, coupleId },
            process.env.INVITE_TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        const FRONTEND_URL = process.env.NODE_ENV === "production"
            ? process.env.FRONTEND_URL_PROD
            : process.env.FRONTEND_URL_LOCAL;

        const inviteLink = `${FRONTEND_URL}/accept-invite?token=${token}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: receiverEmail,
            subject: 'You’ve been invited to join a couple space!',
            html: `
                <p>Hello,</p>
                <p>You’ve been invited to join a couple space by <strong>${senderName}</strong>. Click the link below to accept the invitation:</p>
                <a href="${inviteLink}">Accept Invitation</a>
                <p>If you don't want to join, you can ignore this message.</p>
            `,
        };

        // Save the invitation record before sending the email
        await Invitation.create({
            senderId,
            receiverEmail,
            coupleId,
            expiration: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        // Send the email
        await transporter.sendMail(mailOptions);

        console.log("Invitation email sent successfully!");
    } catch (error) {
        console.error("Error details:", error); // Log the full error details
        throw new ApiError(500, `Error sending invitation email: ${error.message || error}`); // Include the specific error message
    }
};


export default sendEmailInvite;
