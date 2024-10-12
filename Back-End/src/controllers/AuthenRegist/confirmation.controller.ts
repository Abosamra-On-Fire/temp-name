import { Request, Response } from "express";
import { validateEmail, validateCode } from "@validators/confirmation";
import {
    findUser,
    findConfirmedUser,
    confirmUser,
    createSendConfirmation
} from "@services/AuthenRegist/confirmation.service";

const resendConfirmCode = async (req: Request, res: Response): Promise<void> => {
    try {
        //validate email from req body
        const { email } = req.body as Record<string, string>;
        validateEmail(email);

        //find user in redis
        await findUser(email);

        //create and send confirmation email
        await createSendConfirmation(email);

        res.status(200).json({
            status: "success",
        });
    } catch (e: any) {
        console.log(e.message);
        res.status(400).json({
            status: "failed",
            message: e.message,
        });
    }
};

const confirmEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        //validate email and code from req body
        const { email, code } = req.body as Record<string, string>;
        validateCode(email, code);

        //check if code is existed and if code is expried 
        await findConfirmedUser(email, code);

        //Add new account or activate old deleted account
        await confirmUser(email);

        res.status(200).json({
            status: "success",
        });
    } catch (e: any) {
        console.log(e.message);
        res.status(400).json({
            status: "failed",
            message: e.message,
        });
    }
};

export { resendConfirmCode, confirmEmail };
