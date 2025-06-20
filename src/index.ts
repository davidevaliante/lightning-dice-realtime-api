import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import crazyTimeApi from './api/dreamcatcher'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import cors from 'cors'
import cron from 'node-cron'
import { getInitialPageData, getLatestSpins, getLatestTable, getStatsInTheLastHours } from './api/get'
import { TimeFrame, timeFrameValueToHours } from './models/TimeFrame'
import cache from 'memory-cache'

dotenv.config()

const app = express()

const PORT = process.env.PORT

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', crazyTimeApi)

const httpServer = createServer(app)

let clientsCount = 0

cache.put('24-hours-cache', {
    startingTime: 10000,
    data: [...Array(1000000).keys()].map((k) => `${k} key`),
})

const io = new Server(httpServer, {
    cors: {
        origin: [
            '* ',
            // 'http://localhost:3000',
            // 'https://spikemultilanguage.toply.info',
            // 'https://www.spikeslot.com',
            // 'https://spikeslot.com',
            // 'https://spikeslotgratis.com',
            // 'https://www.spikeslotgratis.com',
        ],
        methods: ['GET', 'POST'],
    },
})

io.on('connection', (socket: Socket) => {
    let currentRoom = socket.id
    clientsCount++
    console.log(`${clientsCount} clients connected`)

    Object.values(TimeFrame).forEach((tf) => {
        socket.on(tf, (data) => {
            console.log(`${socket.id} joining ${tf} and leaving ${currentRoom}`)
            socket.join(tf)
            socket.leave(currentRoom)
            currentRoom = tf
        })
    })

    socket.on('disconnect', (reason: string) => {
        clientsCount--
        console.log(`${clientsCount} clients connected`)
    })

    socket.on('message', (data) => {
        console.log(data, `from ${socket.id}`)
    })
})

const tf = TimeFrame.TWENTY_FOUR_HOURS

cron.schedule('*/5 * * * * *', async () => {
    const stats = await getStatsInTheLastHours(timeFrameValueToHours(tf))
    const spins = await getLatestSpins(25)

    io.to(tf).emit(tf, {
        timeFrame: tf,
        spins,
        stats,
    })
})

httpServer.listen(process.env.PORT, () => {
    console.log(`> Realtime API running on port ${PORT}`)

    try {
        mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        const mongoDb = mongoose.connection
        mongoDb.on('error', console.error.bind(console, 'database connection error'))
        mongoDb.once('open', () => {
            console.log('connected to Mongo DB')
            update24HoursCache()
            cron.schedule('*/10 * * * * *', () => {
                update24HoursCache()
            })
        })
    } catch (error) {
        console.error(error)
    }
    console.log(`> Socket initialized on port ${process.env.PORT}`)
})

export const update24HoursCache = async () => {
    const { spinsInTimeFrame, stats } = await getInitialPageData(24)
    cache.put('24-hours-cache', {
        spinsInTimeFrame,
        stats,
    })
}
