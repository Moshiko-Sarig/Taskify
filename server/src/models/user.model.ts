import { executeQueryAsync } from "../database/db";
import userQueries from "../queries/user.queries";
import bcrypt from "bcryptjs";

export interface User {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
}
export interface Credentials_login {
    username?: string;
    email?: string;
    password: string;
}

class UserModel {

    static async addUser(user: User) {
        try {
            const result = await executeQueryAsync(userQueries.ADD_NEW_USER, [
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

    static async login(credentials: Credentials_login) {
        let user;
        if (credentials.email) {
            user = await executeQueryAsync(userQueries.LOGIN_EMAIL, [credentials.email]);
        } else if (credentials.username) {
            user = await executeQueryAsync(userQueries.LOGIN_USERNAME, [credentials.username]);
        } else {
            return null;
        }
    
        if (!user || user.length < 1) return null;
        const hashedPassword = user[0].password;
        const isPasswordMatch = await bcrypt.compare(credentials.password, hashedPassword);
        if (!isPasswordMatch) return null;
        delete user[0].password; 
        return user[0];
    }

    static async checkIfEmailExists(email: string) {
        try {
            const result = await executeQueryAsync(userQueries.CHECK_IF_EMAIL_EXIST, [email]);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async checkIfUsernameExists(username: string) {
        try {
            const result = await executeQueryAsync(userQueries.CHECK_IF_USERNAME_EXIST, [username]);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async updateUserEmailVerified(userId: number, emailVerified: boolean) {
        try {
            const result = await executeQueryAsync(userQueries.UPDATE_EMAIL_VERIFIED, [emailVerified, userId]);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}


export default UserModel;
