import passport from "passport";

const registerMiddleWareLocal = passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register' });

const loginMiddleWareLocal = passport.authenticate('login', { failureRedirect: '/api/sessions/fail-login'});

const postRegisterController = async (req, res) => {
        res.status(200).send({ status: 'ok', message: 'User created successfully' });
}

const postLoginController = async (req, res) => {
        const user = req.user
        if (!user) {
            res.status(401).send({ status: 'error', message: 'Cannot login. Something really bad happened... =/' });
        } else {
            req.session.user = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                rol: user.rol,
                cartId: user.cartId
            }
            res.status(200).send({ status: 'ok', message: 'User logged in successfully', user });
        }
}

const githubAuthenticateMiddleWare = passport.authenticate('github', {scope: ['user:email']});


const getDummyFunction = async (req, res) => {
    //no hace nada
}

const githubCallbackMiddleWare = passport.authenticate('github', {failureRedirect: '/api/sessions/fail-gh'});


const getGitHubCallbackController = async (req, res) => {
        const user = req.user
        if (!user) {
            res.status(401).send({ status: 'error', message: 'Cannot login. Something really bad happened... =/' });
        } else {
            req.session.user = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                rol: user.rol,
                cartId: user.cartId
            }
            res.redirect('/products');
        }
    
}

const getFailRegisterController = (req, res) => {
    res.render('error', { error: 'No se pudo registrar el usuario en forma Local'});
}

const getFailLoginController = (req, res) => {
    res.render('error', { error: 'No se pudo iniciar sesión en forma Local'});
}

const getFailGHController = (req, res) => {
    res.render('error', { error: 'No se pudo iniciar sesión/registrarse con GitHub'});
}


export { registerMiddleWareLocal, loginMiddleWareLocal, postRegisterController, postLoginController, githubAuthenticateMiddleWare, getDummyFunction, githubCallbackMiddleWare, getGitHubCallbackController, getFailRegisterController, getFailLoginController, getFailGHController }