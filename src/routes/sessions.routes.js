import { Router } from "express";
import userModel from "../dao/models/user.model.js";

const router = Router();

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    if (first_name && last_name && email && password) {
        const usuarioYaExiste = await userModel.findOne({ email: email });
        if (usuarioYaExiste) {
            return res.status(400).send({ status: 'error', message: 'User already registered' });
        } else {
            let usuario = null;
            const nuevoUsuario = { first_name, last_name, email, age, password };
            try {
                usuario = await userModel.create(nuevoUsuario);
            }
            catch (error) {
                console.log("ERROR: " + error);
            }
            return res.status(201).send({ status: 'ok', message: 'User created successfully', generated_id: usuario.id });
        }
    } else {
        return res.status(400).send({ status: 'error', message: 'Cannot continue: first_name, last_name, email and password fields are required.' });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    let usuarioExiste = null;
    let rol = 'Usuario';
    if (email == 'adminCoder@coder.com' && password == 'adminCod3r123') {
        usuarioExiste = { first_name: 'Admin', last_name: 'Coder', email: 'adminCoder@coder.com', age: 99 }
        rol = "Admin";
    } else {
        usuarioExiste = await userModel.findOne({ email: email, password: password });
    }
    if (!usuarioExiste) {
        return res.status(401).send({ status: 'error', message: 'Invalid credentials' });
    } else {
        req.session.user = {
            name: `${usuarioExiste.first_name} ${usuarioExiste.last_name}`,
            email: usuarioExiste.email,
            age: usuarioExiste.age,
            rol: rol
        }
        return res.status(200).send({ status: 'ok', message: 'User logged in successfully', payload: req.session.user });
    }

});


export default router;