import { Router } from 'express';
import { usersControllers } from '../controllers/users.controllers.js'
import { isProfileComplete } from '../controllers/sessions.controller.js';
import { uploader } from '../utils.js';
import { userManager } from "../services/factory.js"
const router = Router();

//GET
router.get("/premium/:uid", isProfileComplete, usersControllers);


//POST
router.post("/:uid/documents", uploader.fields(
    [
        { name: "identificationDocument", maxCount: 1 },
        { name: "addressDocument", maxCount: 1 },
        { name: "accountDocument", maxCount: 1 },
        { name: "profilePicture", maxCount: 1},
        { name: "productPicture", maxCount: 1}
    ]
),  async (req, res) => {
    if (req.files.identificationDocument) {
        userManager.updateUserDocuments(req.params.uid, "identificationDocument", req.files.identificationDocument[0].path);
    }
    if (req.files.addressDocument) {
        userManager.updateUserDocuments(req.params.uid, "addressDocument", req.files.addressDocument[0].path);
    }
    if (req.files.accountDocument) {
        userManager.updateUserDocuments(req.params.uid, "accountDocument", req.files.accountDocument[0].path);
    }
    if (req.files.profilePicture) {
        userManager.updateUserDocuments(req.params.uid, "profilePicture", req.files.profilePicture[0].path);
    }
    if (req.files.productPicture) {
        userManager.updateUserDocuments(req.params.uid, "productPicture", req.files.productPicture[0].path);
    }
    res.send("Documentos subidos correctamente");
});

export default router;