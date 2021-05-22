const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const userRoutes = require('./api/routes/userRoutes');
const authRoutes = require('./api/routes/authRoutes');
const faDefintionRoutes = require('./api/routes/faDefintionRoutes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.listen(3000, () => {
    console.log('Server uspješno pokrenut!')
});

app.use('/user', userRoutes)
app.use('/auth', authRoutes)
app.use('/faDefintion', faDefintionRoutes)

