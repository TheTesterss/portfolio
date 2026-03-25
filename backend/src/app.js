const express = require('express');
const cors = require('cors');
const setContactRoutes = require('./routes/contact.route');
const setTestRoutes = require('./routes/test.route');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: process.env.FRONTEND_ORIGIN || '*'
};
app.use(cors(corsOptions));

app.use(express.json());

setContactRoutes(app);
setTestRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
