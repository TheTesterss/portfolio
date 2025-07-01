const express = require('express');
const ContactController = require('../controllers/contact.controller');

const setContactRoutes = (app) => {
    const contactController = new ContactController();
    app.post('/api/contact', contactController.addContact.bind(contactController));
};

module.exports = setContactRoutes;
