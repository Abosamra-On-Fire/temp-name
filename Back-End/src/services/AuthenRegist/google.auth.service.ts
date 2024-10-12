import { User } from "@prisma/client";
import db from "src/prisma/PrismaClient";
import bcrypt from "bcrypt";
import randomstring from "randomstring";

//This is a service for making a request to get user data of google account based on specified scopes using google tokenThis is a service for making a request to get user data of google account based on specified scopes using google token
const getUserData = async (token: string): Promise<Record<string, any> | undefined> => {
    try {
        const response: Response = await fetch(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
        );
        const data: Record<string, any> = await response.json();
        if (!data.email_verified || data.error) {
            return undefined;
        }
        return data;
    } catch (err: any) {
        console.log(err.message);
        return undefined;
    }
};

const upsertUser = async (data: Record<string, any>): Promise<User> => {
    const user_data: {
        name: string;
        email: string;
        password: string;
    } = {
        name: data.name,
        email: data.email,
        password: bcrypt.hashSync(randomstring.generate({ length: 250 }), 10),
    };
    // update in case user is already existed and just login
    // create in case user is not existed and login
    const user: User = await db.user.upsert({
        where: { email: user_data.email },
        update: { loggedInDevices: { increment: 1 } },
        create: {
            ...user_data,
            loggedInDevices: 1
        },
    });
    return user;
};

export { getUserData, upsertUser };
