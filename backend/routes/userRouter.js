/* Set the routes here and connect them to the correct controller functions */


import { Router } from "express";
import { getUsers, addUser, login, refreshAccessToken, logout, deleteprofile} from
"../controllers/userController.js";
import { getUserGroups } from "../controllers/groupController.js";
import { authenticateToken } from "../middleware/auth.js";
const userRouter = Router();

// Public routes
userRouter.post("/register", addUser);
userRouter.post("/login", login);
userRouter.post("/refresh", refreshAccessToken);
userRouter.post("/logout", logout);

// hakee käyttäjän ryhmät jotta ne näkyy profiilissa
userRouter.get('/user/:username', getUserGroups);

// Protected routes (requires authentication)
userRouter.get("/", authenticateToken, getUsers);
userRouter.delete("/deleteprofile", authenticateToken, deleteprofile);
export default userRouter;
