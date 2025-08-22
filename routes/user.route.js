import express from "express";
import userController from "../controllers/user.controllers.js";
import verifyToken from "../middleware/auth.js";
const router = express.Router();

router.get("/", verifyToken, userController.getUsersController);
router.get("/:id", userController.getSingleUserController);
router.post("/", userController.createUserController);
router.put("/:id", userController.updateUserController);
router.delete("/:id", userController.deleteUserController);
router.post("/login", userController.loginUserController);

export default router;
