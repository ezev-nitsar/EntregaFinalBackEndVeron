import { Router } from 'express';
import { MessageManager } from '../dao/mongoDb/messageManager.db.js';
const router = Router();

router.get('/', async (req, res) => {
    res.render('chat');
});

router.post('/newChat', async (req, res) => {
    const userName = req.body.userName;
    const message = req.body.message;
    if (userName && message) {
        const Mensajes = new MessageManager();
        const result = await Mensajes.writeMessage(userName, message);
        res.send(result);
    } else {
        res.send('{"status":"failed", "message":"Incomplete params"}');
    }
});

export default router