import { Router } from "express";
import passport from "passport";

const router = Router();

router.post("/register", passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register' }), async (req, res) => {
    res.status(201).send({ status: 'ok', message: 'User created successfully' });
});

router.post("/login", passport.authenticate('login', { failureRedirect: '/api/sessions/fail-login'}), async (req, res) => {
    const user = req.user
    if (!user) {
        res.status(401).send({ status: 'error', message: 'Cannot login. Something really bad happened... =/' });
    } else {
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            rol: user.rol
        }
        res.status(200).send({ status: 'ok', message: 'User logged in successfully', user });
    }
});

router.get ("/github", passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {});

router.get ("/github-callback", passport.authenticate('github', {failureRedirect: '/api/sessions/fail-gh'}), async (req, res) => {

    const user = req.user
    if (!user) {
        res.status(401).send({ status: 'error', message: 'Cannot login. Something really bad happened... =/' });
    } else {
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            rol: user.rol
        }
        res.redirect('/products');
    }
});


router.get("/fail-register", (req, res) => {
    res.render('error', { error: 'No se pudo registrar el usuario en forma Local'});
});

router.get("/fail-login", (req, res) => {
    res.render('error', { error: 'No se pudo iniciar sesión en forma Local'});
});

router.get("/fail-gh", (req, res) => {
    res.render('error', { error: 'No se pudo iniciar sesión/registrarse con GitHub'});
});

export default router;