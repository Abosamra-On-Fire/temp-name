import { Request, Response } from "express";
import { validateSingUp } from "@validators/user";
import { findUser, saveUser } from "@services/AuthenRegist/signup.service";
import { createSendConfirmation } from "@services/AuthenRegist/confirmation.service";

const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        //validate user data recieved from request body
        const { name, email, password, confirmPass }: Record<string, string> = req.body;
        let phoneNumber: string = req.body.phone_number;
        phoneNumber = validateSingUp(name, email, phoneNumber, password, confirmPass);
        //check if user is found in database and actived
        await findUser(email, password);

        //create and send confirmation code to email
        await createSendConfirmation(email);
        //save user data in redis until confirmation
        await saveUser(name, email, phoneNumber, password);

        res.status(200).json({
            status: "success",
            user_data: {
                name,
                email,
            },
        });
    } catch (e: any) {
        console.log(e.message);
        res.status(400).json({
            status: "failed",
            message: e.message,
        });
    }
};

export default signup;
