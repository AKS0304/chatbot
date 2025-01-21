import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function sendMessage(to, text) {
    try {
        const url = process.env.WHATSAPP_API_URL;
        const token = process.env.VERIFY_TOKEN;

        const messageData = {
            messaging_product: 'whatsapp',
            to,
            text: { body: text },
        };

        await axios.post(url, messageData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Error sending message:', error);
    }
}
