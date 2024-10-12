import { User, AccountStatus } from "@prisma/client";
import db from "src/prisma/PrismaClient";
import bcrypt from "bcrypt";

const findUser = async (email: string, password: string): Promise<User> => {
    const user: User | null = await db.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error("Email doesn't exist");
    }
    if (user.accountStatus === AccountStatus.Deactivated) {
        throw new Error("Account is deactivated");
    }
    if (!bcrypt.compareSync(password, user.password)) {
        throw new Error("Incorrect password. Try again");
    }
    return user;
};


async function incrementDevices(userId: number) {
    await db.user.update({
        where: { id: userId },
        data: {
            loggedInDevices: { increment: 1 }
        }
    });
}

export { findUser, incrementDevices };
