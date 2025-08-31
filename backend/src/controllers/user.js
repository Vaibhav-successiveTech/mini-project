import UserModel from "../models/User.js"
import { Router } from "express"
import authiorizeMiddleware from "../middleware/tokenMiddleware.js";
const UserRouter = Router();

UserRouter.get('/users', authiorizeMiddleware, async (req, res) => {
    try {
        const allUsers = await UserModel.find();
        const users = allUsers.filter((i) => i._id != req.user);
        res.status(200).json({ user: users });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

UserRouter.get('/users/:id', authiorizeMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})


export default UserRouter;