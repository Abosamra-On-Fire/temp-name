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
exports.upsertUser = exports.getUserData = void 0;
const PrismaClient_1 = __importDefault(require("src/prisma/PrismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const randomstring_1 = __importDefault(require("randomstring"));
//This is a service for making a request to get user data of google account based on specified scopes using google tokenThis is a service for making a request to get user data of google account based on specified scopes using google token
const getUserData = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        const data = yield response.json();
        return data;
    }
    catch (err) {
        console.log(err.message);
        return undefined;
    }
});
exports.getUserData = getUserData;
const upsertUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phone_number,
        password: bcrypt_1.default.hashSync(randomstring_1.default.generate({ length: 250 }), 10),
        emailStatus: "Activated",
    };
    const user = yield PrismaClient_1.default.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData,
    });
    return user;
});
exports.upsertUser = upsertUser;
