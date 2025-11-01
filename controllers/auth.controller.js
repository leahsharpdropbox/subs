import mongoose from "mongoose";
import User from "../models/user.model";
import bcrypt from "bcryptjs";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession(); 
    session.startTransaction(); // why isn't this and the above line be wrapped in a try block can't this be failed as well
    try {
        const { name, email, password } = req.body; // does what's in {} mean we only want these and ibgore the rest of the properties
        const existingUser = await User.findOne({ email }); // generally speaking what can be passed in findOne? only indexed or all attributes?
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409; // can status code be passed in directly in the prior line or no?
            throw error;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUsers = await User.create([{ name, email, password: hashedPassword}], {session});  // does create's first param must be a list, also why hashedpassword must be prefixed by password? and what's the mechanism for {session}, when it get passed in
        
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }

}
export const signIn = async (req, res, next) => {}
export const signOut = async (req, res, next) => {}