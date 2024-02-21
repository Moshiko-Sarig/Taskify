"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../database/db");
const user_queries_1 = __importDefault(require("../queries/user.queries"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserModel {
    static async addUser(user) {
        try {
            const result = await (0, db_1.executeQueryAsync)(user_queries_1.default.ADD_NEW_USER, [
                user.first_name,
                user.last_name,
                user.username,
                user.email,
                user.password,
            ]);
            return result;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    static async login(credentials) {
        let user;
        if (credentials.email) {
            user = await (0, db_1.executeQueryAsync)(user_queries_1.default.LOGIN_EMAIL, [credentials.email]);
        }
        else if (credentials.username) {
            user = await (0, db_1.executeQueryAsync)(user_queries_1.default.LOGIN_USERNAME, [credentials.username]);
        }
        else {
            return null;
        }
        if (!user || user.length < 1)
            return null;
        const hashedPassword = user[0].password;
        const isPasswordMatch = await bcryptjs_1.default.compare(credentials.password, hashedPassword);
        if (!isPasswordMatch)
            return null;
        delete user[0].password;
        return user[0];
    }
    static async checkIfEmailExists(email) {
        try {
            const result = await (0, db_1.executeQueryAsync)(user_queries_1.default.CHECK_IF_EMAIL_EXIST, [email]);
            return result;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    static async checkIfUsernameExists(username) {
        try {
            const result = await (0, db_1.executeQueryAsync)(user_queries_1.default.CHECK_IF_USERNAME_EXIST, [username]);
            return result;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    static async updateUserEmailVerified(userId, emailVerified) {
        try {
            const result = await (0, db_1.executeQueryAsync)(user_queries_1.default.UPDATE_EMAIL_VERIFIED, [emailVerified, userId]);
            return result;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
}
exports.default = UserModel;
