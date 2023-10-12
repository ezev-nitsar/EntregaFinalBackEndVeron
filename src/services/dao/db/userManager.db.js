import userModel from './models/user.model.js';
export class UserManager {
    createUser = async (user) => {
        return await userModel.create(user);
    }

    getUsers = async () => {
        return await userModel.find();
    }

    getUserById = async (id) => {
        return await userModel.findById(id);
    }

    getUserByEmail = async (email) => {
        return await userModel.findOne({ email });
    }
}