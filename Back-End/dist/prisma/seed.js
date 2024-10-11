"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const bcrypt_1 = __importDefault(require("bcrypt"));
const PrismaClient_1 = __importDefault(require("./PrismaClient"));
// Passwords of 5 users in order.
const passwords = ["abcdefg", "1234567", "aaaabbb", "1111111", "2222222"];
// Utility function to create random users
function createUsers(numUsers) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = [];
        for (let i = 0; i < numUsers; i++) {
            const user = yield PrismaClient_1.default.user.create({
                data: {
                    email: faker_1.faker.internet.email(),
                    name: faker_1.faker.person.fullName(),
                    phoneNumber: faker_1.faker.phone.number({ style: "international" }),
                    password: bcrypt_1.default.hashSync(passwords[i], 10),
                    emailStatus: faker_1.faker.helpers.arrayElement(["Activated", "Deactivated"]),
                },
            });
            users.push(user);
        }
        return users;
    });
}
// Utility function to create random chats
function createChats(numChats, users) {
    return __awaiter(this, void 0, void 0, function* () {
        const chats = [];
        for (let i = 0; i < numChats; i++) {
            const chat = yield PrismaClient_1.default.chat.create({});
            // Randomly select participants for this chat
            const participants = faker_1.faker.helpers.arrayElements(users, 2); // Pick 2 random users
            // Add participants to chat
            for (const user of participants) {
                yield PrismaClient_1.default.chatParticipant.create({
                    data: {
                        chatId: chat.id,
                        userId: user.id,
                    },
                });
            }
            chats.push({ chat, participants });
        }
        return chats;
    });
}
// Utility function to create messages for chats
function createChatMessages(chats) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const chat of chats) {
            const numMessages = faker_1.faker.number.int({ min: 1, max: 10 }); // Random number of messages per chat
            for (let i = 0; i < numMessages; i++) {
                const sender = faker_1.faker.helpers.arrayElement(chat.participants); // Randomly pick a sender
                const message = yield PrismaClient_1.default.chatMessage.create({
                    data: {
                        content: faker_1.faker.lorem.sentence(),
                        senderId: sender.id,
                        createdAt: faker_1.faker.date.recent(),
                        chatId: chat.chat.id,
                    },
                });
                //update each chat with the created message
                yield PrismaClient_1.default.chat.update({
                    where: { id: chat.chat.id },
                    data: {
                        lastMessageId: message.id,
                    },
                });
            }
        }
    });
}
// Main function to implement the seeding
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const numUsers = 5;
        const numChats = 3;
        //Create Users
        const users = yield createUsers(numUsers);
        console.log(`Created ${users.length} users.`);
        //Create Chats
        const chats = yield createChats(numChats, users);
        console.log(`Created ${chats.length} chats.`);
        //Create Messages for each chat
        yield createChatMessages(chats);
        console.log("Created messages for all chats.");
    });
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
