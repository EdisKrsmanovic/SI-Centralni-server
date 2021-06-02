require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const userRoutes = require('./api/routes/userRoutes');
const authRoutes = require('./api/routes/authRoutes');
const faDefintionRoutes = require('./api/routes/faDefintionRoutes');

const DBStartHelper = require('./api/repositories/start');
const campaignRoutes = require('./api/routes/campaignRoutes');
const questionRoutes = require('./api/routes/questionRoutes');
const answerRoutes = require('./api/routes/answerRoutes');
const deviceRoutes = require('./api/routes/deviceRoutes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

DBStartHelper.resetDB().then(() => {
    DBStartHelper.createDB().then(() => {
        DBStartHelper.fillDB();
    });
});

app.use('/api/campaign', campaignRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/answer', answerRoutes);
app.use('/api/device', deviceRoutes);

app.get('/api/database/reset', (req, res) => {
    DBStartHelper.resetDB().then(() => {
        DBStartHelper.createDB().then(() => {
            DBStartHelper.fillDB().then(() => {
                res.send("DB RESET"); 
            });
        });
    });
    
    
    });

port = process.env.PORT || 3000;



app.listen(port, () => {
    console.log('Server uspješno pokrenut!')
});

app.get('/', (req, res) => { res.send("<h1>Up and running.</h1>"); });

app.use('/user', userRoutes)
app.use('/auth', authRoutes)
app.use('/faDefinition', faDefintionRoutes)

