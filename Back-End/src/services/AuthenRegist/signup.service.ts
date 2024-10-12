import { User, AccountStatus } from "@prisma/client";
import db from "src/prisma/PrismaClient";
import redis from '@redis';
import bcrypt from "bcrypt";

const findUser = async (email: string, password: string): Promise<void> => {
    const foundUser: User | null = await db.user.findUnique({
        where: { email, accountStatus: AccountStatus.Activated },
    });
    if (foundUser) {
        throw new Error("Email is already found and activated");
    }
};


const saveUser = async (
    name: string,
    email: string,
    phoneNumber: string,
    password: string,
): Promise<void> => {
    // Save user's data in redis and set expire time for this data (3 hours)
    await redis.hSet(email, { name, email, phoneNumber, password: bcrypt.hashSync(password, 10) });
    await redis.expire(email, 10800)
};

export { findUser, saveUser };
