import { Router } from "express";
import * as userController from '../Controller/UserController.js';
import verifyToken from "../middelwares/verifyToken.js";

const userRouter = Router();

userRouter.route('/register').post(userController.createUser);
    
userRouter.route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser)
    .put(userController.updateUser);


//Login and verify
userRouter.route('/login').post(userController.login);
userRouter.get("/profile", verifyToken, userController.getUser2);
export default userRouter;

//Logout

userRouter.get("/logout", verifyToken, userController.logout);