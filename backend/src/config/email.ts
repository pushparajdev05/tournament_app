import nodemailer from "nodemailer";
import { env } from "./envConfig";
export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
    },
});
export default transporter