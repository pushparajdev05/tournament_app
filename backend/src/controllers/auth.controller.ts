import { Request, Response } from "express";
import { User } from "@/models/user.model";
import { 
    register as registerService,  // Renamed to avoid conflicts
    loginUser, 
    resetPassword, 
    getUser,
    updateUserProfile as updateUserProfileService,
    confirmResetPassword
} from "@/services/auth.service";
import { handleServiceResponse } from "@/utils/httpHandlers";

// Register
export const registerUser = async (req: Request, res: Response) => {

    const { username,email, password } = req.body;
    const resObj = await registerService( username,email, password);
    handleServiceResponse(resObj,res);
};

// Login
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const resObj = await loginUser(email, password);
    handleServiceResponse(resObj, res);
};

// Get User Profile
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const resObj = await getUser(userId);
        handleServiceResponse(resObj, res);
};

// Update User Profile t
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const updateData = req.body;
    const resObj = await updateUserProfileService(userId, updateData);
    handleServiceResponse(resObj, res);

};

// Forgot Password
export const resetPasswordHandler = async (req: Request, res: Response) => {

        const { email } = req.body;
    const resObj = await resetPassword(email);
    handleServiceResponse(resObj, res);
};

// Reset Password (Confirm new password)
export const confirmResetPasswordHandler = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    const resObj = await confirmResetPassword(token, newPassword);
    handleServiceResponse(resObj, res);
};
