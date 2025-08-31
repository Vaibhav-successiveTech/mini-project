import registerRouter from "./Register.js";
import loginRouter from "./login.js";
import postRouter from "./post.js";
import profileRouter from "./profile.js";
import UserRouter from "./user.js";
import Router from 'router'

const allRouter = Router();
allRouter.use(registerRouter);
allRouter.use(loginRouter);
allRouter.use(postRouter);
allRouter.use(profileRouter);
allRouter.use(UserRouter);
export default allRouter;