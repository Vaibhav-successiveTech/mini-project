import Router from "router";
import UserModel from "../models/User.js";
import zod from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ProfileModel from "../models/Profile.js";

const User = zod.object({
    name:zod.string().min(1),
    email:zod.string().email(),
    password:zod.string()
});

const registerRouter = Router();

registerRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const avatar = req.body.avatar?req.body.avatar:'/default-avatar.png';
    const parsed = User.safeParse({ name, email, password,avatar });
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error });
    }
    try {
        const findOne = await UserModel.findOne({ email });
        if(findOne){
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword ,avatar});
        await newUser.save();
        const newProfile = new ProfileModel({user:newUser._id,name,email,skills:[]});
        await newProfile.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "5h" });
        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
})

export default registerRouter;