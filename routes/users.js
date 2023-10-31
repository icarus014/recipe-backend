// auth file
import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { UserModel } from "../models/users.js";

const router = express.Router();

router.post("/register", async (req,res)=>{
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (user){
        return res.json({message: "user already exists"})
    }
    const hashed = await bcrypt.hash(password, 10)

    const newUser = new UserModel({ username, password: hashed })
    await newUser.save()

    res.json({message: "user registered"});
})
    // login route
router.post("/login", async (req,res)=>{
    const {username, password} = req.body
    const user = await UserModel.findOne({ username });

    if(!user) {
        return res.json({message: "User Doesn't Exist"})
    }
        // checks for valid password/
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid){
        return res.json({message: "Username or Password is Incorrect"})
    }
        // creating a token
    const token  = jwt.sign({id: user._id}, "secret");
    res.json({token, userID: user._id})
})

// exporting more than 1 router
export { router as userRouter}