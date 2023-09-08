import passport from 'passport';
import passportLocal from 'passport-local';
import GitHubStrategy from 'passport-github2';
import userModel from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';

//Declaramos nuestra estrategia:
const localStrategy = passportLocal.Strategy;
const initializePassport = () => {

    //githubStrategy
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.7dedd1b3bb18e534',
            clientSecret: 'b099817e15bb81cad360abace53cdc05994cb9fc',
            callbackUrl: 'http://localhost:8080/api/sessions/github-callback'
        },
        async (accessToken, refreshToken, profile, done) => {

            try {
                const user = await userModel.findOne({ email: profile._json.email })
                if (!user) {
                    //como el usuario no existe, lo genero
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '{GitHub}',
                        age: '15', //GitHub fue fundado en 2008 ;=)
                        email: profile._json.email,
                        password: '',
                        registerMethod: "GitHub"
                    }
                    const result = await userModel.create(newUser)
                    result.rol = "Usuario";
                    done(null, result)
                }
                else {
                    user.rol = "Usuario";
                    return done(null, user)
                }
            } catch (error) {
                return done(error)
            }
        }));

    //localStrategy
    //Registrar usuario con localStrategy
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                const exists = await userModel.findOne({ email });
                if (exists) {
                    return done(null, false);
                }
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    registerMethod: "App-Local"
                };
                const result = await userModel.create(user);
                return done(null, result);
            } catch (error) {
                return done("ERROR: " + error);
            }
        }
    ));

    //Login con localStrategy
    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {
            try {
                let user = false;
                if (email == 'adminCoder@coder.com' && password == 'adminCod3r123') {
                    user = { _id: '64ed06ae2254d09457e26b9a', first_name: 'Admin', last_name: 'Coder', email: 'adminCoder@coder.com', age: 99, rol: "Admin" }
                } else {
                    user = await userModel.findOne({ email: email });

                    if (!user) {
                        return done(null, false);
                    }
                    if (!isValidPassword(user, password)) {
                        return done(null, false);
                    }
                    user.rol = "Usuario";
                }
                return done(null, user);

            } catch (error) {
                return done(error);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("ERROR: " + error);
        }
    });
};

export default initializePassport;