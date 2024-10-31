const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { distributePrizePool } = require('./cron/distributePrizePoolCron');
const cron = require('node-cron');
const redisClient = require('./redis/redisClient')
const http = require('http');
const socketIo = require('socket.io');

require('dotenv').config()

const playersRoute = require('./routes/playerRoutes')
const leaderboardRoute = require('./routes/leaderboardRoutes')

const app = express();
app.use(bodyParser.json());
app.use(cors())
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('updateLeaderboard', (data) => {
        io.emit('leaderboardUpdated', data);
    });
});

app.locals.redisClient = redisClient;
app.set('socketio', io);

// const checkDatabaseExists = async () => {
//     const admin = mongoose.connection.db.admin();
//     const databases = await admin.listDatabases();

//     const dbExists = databases.databases.some(db => db.name === 'titanlorydb');

//     if (!dbExists) {
//         console.log('Database does not exist. It will be created automatically on the first write.');
//     } else {
//         console.log('Database already exists.');
//     }
// };

//take these values from .env
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB.');
        //return checkDatabaseExists();
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
    });

app.use('/players', playersRoute);
app.use('/leaderboard', leaderboardRoute);

cron.schedule('0 0 * * 0', async () => {
    try {
        console.log('Cron job running')
        await distributePrizePool(io);
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

//!!!!! FOR TEST
// cron.schedule('*/5 * * * *', async () => {
//     try {
//         console.log('Cron job running')
//         await distributePrizePool(io);
//     } catch (error) {
//         console.error('Error in cron job:', error);
//     }
// });


server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}.`);
});
