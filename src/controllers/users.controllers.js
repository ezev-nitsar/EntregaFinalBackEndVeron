import { userManager } from "../services/factory.js"
import { useLogger } from "../config/logger.config.js";

const usersControllers = async (req, res) => {
    const uid = req.params.uid;
    try {
        const user = await userManager.getUserById(uid);
        res.setHeader('Content-Type', 'application/json');
        if (user.role === 'Admin') {
            res.status(200).send({ status: 'failed', message: 'User is already admin, this operation cannot be done' });
        } else if (user.role === 'Usuario') {
            user.role = 'Premium';
            await userManager.updateUser(user._id, user);
            res.status(200).send({ status: 'ok', message: 'Profile updated. ' + user.first_name + ' has now PREMIUM role' });
        } else if (user.role === 'Premium') {
            user.role = 'Usuario';
            await userManager.updateUser(user._id, user);
            res.status(200).send({ status: 'ok', message: 'Profile updated. ' + user.first_name + ' has now USER role' });
        } else {
            res.status(400).send({ status: 'failed', message: 'Unexpected user type' });
        }
    }
    catch (error) {
        const log = useLogger();
        log.error(`${new Date().toLocaleString()}: ${error.message}`);
    }
}
export { usersControllers }