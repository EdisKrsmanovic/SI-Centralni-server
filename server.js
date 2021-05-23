require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const userRoutes = require('./api/routes/userRoutes');
const authRoutes = require('./api/routes/authRoutes');
const faDefintionRoutes = require('./api/routes/faDefintionRoutes');
port = process.env.PORT || 3333

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => {
    console.log('Server uspješno pokrenut!')
});

app.use('/user', userRoutes)
app.use('/auth', authRoutes)
app.use('/faDefinition', faDefintionRoutes)

