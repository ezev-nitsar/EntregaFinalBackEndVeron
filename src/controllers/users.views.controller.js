
const getLoginController = (req, res) => {
    res.render('login');
}

const getRegisterController = (req, res) => {
    res.render('register');
}

const getProfileController = (req, res) => {
    res.render('profile', { user: req.session.user });
}
export { getLoginController, getRegisterController, getProfileController }