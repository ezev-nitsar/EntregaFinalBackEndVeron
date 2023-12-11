import { Router } from "express";
import { getLoginController, getRegisterController, getProfileController } from "../controllers/users.views.controller.js";
import { getUserDocuments } from "../controllers/users.controllers.js";
const router = Router ();

//GET
router.get("/login", getLoginController);
router.get("/register", getRegisterController);
router.get("/profile", getProfileController);
router.get("/:uid/documents", getUserDocuments);

export default router;