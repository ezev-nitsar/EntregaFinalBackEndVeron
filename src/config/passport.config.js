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
            clientID: 'Iv1.1e78db8dda19e717',
            clientSecret: 'b34a986e954a34643dffc94b5fbbbf3961c0daf9',
            callbackUrl: 'http://localhost:9090/api/sessions/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {

            try {
                const user = await userModel.findOne({ email: profile._json.email })
                
                if (!user) {
                    //como el usuario no existe, lo genero
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        age: 0,
                        email: profile._json.email,
                        password: '',
                        registerMethod: "GitHub"
                    }
                    const result = await userModel.create(newUser)
                    done(null, result)
                }
                else {
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
                    console.log("El usuario ya existe.");
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
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                console.log("Usuario encontrado para login:");
                console.log(user);
                if (!user) {
                    console.warn("User doesn't exists with username: " + username);
                    return done(null, false);
                }
                if (!isValidPassword(user, password)) {
                    console.warn("Invalid credentials for user: " + username);
                    return done(null, false);
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