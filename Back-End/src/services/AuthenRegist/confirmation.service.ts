import db from "src/prisma/PrismaClient";
import { AccountStatus } from "@prisma/client";
import redis from "@redis";
import Randomstring from "randomstring";
import transporter from "@config/email.config";

const findUser = async (email: string) => {
    // Check if there is a data in redis for new account or to activate deleted account
    const foundUser = await redis.hGetAll(email);
    if (foundUser) {
        throw new Error("Email is not found");
    }
};

async function createSendConfirmation(email: string) {
    // Generate confirmation code. Calculate expire time of this code (after 5 minutes)
    const confirmationCode: string = Randomstring.generate(8);
    const expireAt = new Date(Date.now() + 300000).toString();
    // Save it in redis and set expire time for this key (10 minutes)
    await redis.hSet(confirmationCode, { email, expireAt });
    await redis.expire(confirmationCode, 600);
    // Make email body including confirmation code and send it 
    const email_body: string = `<h3>Hello from Omar,</h3> <p>Thanks for joining our family. Use this code: <b>${confirmationCode}</b> for verifing your email</p>`;
    const info = await transporter.sendMail({
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Email verfication",
        html: email_body,
    });
    if (!info) {
        throw new Error("Error in sending email");
    }
}

const findConfirmedUser = async (email: string, code: string) => {
    const foundEmail = await redis.hGetAll(code);
    if (!foundEmail || foundEmail.email !== email) {
        throw new Error("Invalid code");
    }
    if (new Date > new Date(foundEmail.expireAt)) {
        throw new Error("Expried code");
    }
};


const confirmUser = async (email: string) => {
    const foundData = await redis.hGetAll(email);
    if (!foundData) {
        throw new Error(`User's data is not found`);
    }
    const userData = {
        name: foundData.name,
        email: foundData.email,
        phoneNumber: foundData.phoneNumber,
        password: foundData.password
    }
    // update in case email is existed but deactivated (deleted)
    // create is case email is not existed
    await db.user.upsert({
        where: { email, accountStatus: AccountStatus.Deactivated },
        update: {
            ...userData,
            accountStatus: AccountStatus.Activated,
            loggedInDevices: 0
        },
        create: { ...userData }
    })
};

export { findUser, createSendConfirmation, findConfirmedUser, confirmUser };
