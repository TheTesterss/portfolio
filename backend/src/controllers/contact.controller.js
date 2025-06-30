require('dotenv').config();
const axios = require('axios');

class ContactController {
    async addContact(req, res) {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'name, email and message are required' });
        }
        
        const webhookUrl = process.env.WEBHOOK_URL;
        if (!webhookUrl) {
            return res.status(500).json({ error: 'Webhook URL not configured' });
        }

        try {
            await axios.post(webhookUrl, {
                name,
                email,
                message
            });
            res.status(200).json({ success: true, message: 'Contact sent via webhook' });
        } catch (error) {
            console.error('Webhook error:', error.message);
            res.status(500).json({ error: 'Failed to send contact via webhook' });
        }
    }
}

module.exports = ContactController;