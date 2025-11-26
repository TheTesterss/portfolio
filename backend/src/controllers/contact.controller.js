require('dotenv').config();
const axios = require('axios');

class ContactController {
    async addContact(req, res) {
        const name = req.body.name && String(req.body.name).trim();
        const email = req.body.email && String(req.body.email).trim();
        const message = req.body.message && String(req.body.message).trim();

        const missing = [];
        if (!name) missing.push('name');
        if (!email) missing.push('email');
        if (!message) missing.push('message');
        if (missing.length) {
            return res.status(400).json({ error: 'Missing required fields', missing });
        }

        const webhookUrl = process.env.WEBHOOK_URL;
        if (!webhookUrl) {
            return res.status(500).json({ error: 'Webhook URL not configured' });
        }

        try {
            const discordPayload = {
                username: 'Portfolio Contact Bot',
                embeds: [
                    {
                        title: 'Contact',
                        fields: [
                            { name: 'Name', value: name || '-', inline: true },
                            { name: 'Email', value: email || '-', inline: true },
                            { name: 'Message', value: message || '-' }
                        ],
                        timestamp: new Date().toISOString()
                    }
                ]
            };

            const resp = await axios.post(webhookUrl, discordPayload, { timeout: 5000, headers: { 'Content-Type': 'application/json' } });
            res.status(200).json({ success: true, message: 'Contact sent via webhook' });
        } catch (error) {
            console.error('Webhook error:', error && error.message ? error.message : error);
            if (error && error.response) {
                console.error('Webhook response status:', error.response.status);
                console.error('Webhook response data:', error.response.data);
            } else if (error && error.request) {
                console.error('No response received from webhook. Request info:', error.request);
            } else {
                console.error('Error setting up webhook request:', error);
            }

            const details = error && error.response
                ? { status: error.response.status }
                : { message: error && error.message ? error.message : 'unknown' };

            res.status(502).json({ error: 'Failed to send contact via webhook', details });
        }
    }
}

module.exports = ContactController;
