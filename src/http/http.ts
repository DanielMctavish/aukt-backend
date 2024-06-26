import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { json } from 'body-parser'
import "./webSocket"

import { AukCronBot } from '../auk-cron-bot/AukCronBot'

import adminRoutes from './routes/AdminRoutes'
import advertiserRoutes from './routes/AdvertiserRoutes'
import auctRoutes from './routes/AuctRoutes'
import clientRoutes from './routes/ClientRoutes'
import creditRoutes from './routes/CreditCardRoutes'
import productRoutes from './routes/ProductRoutes'
import moderatorRoutes from "./routes/ModeratorRoutes"

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(json())

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // 
}))



app.use('/admin', adminRoutes)
app.use('/advertiser', advertiserRoutes)
app.use('/auct', auctRoutes)
app.use('/client', clientRoutes)
app.use('/credit-card', creditRoutes)
app.use('/products', productRoutes)
app.use('/moderator', moderatorRoutes)

app.get('/', (req, res) => {
    res.send('AUKT API version 1.0 - changes')
})

app.get('/check-api', (req, res) => {
    res.send('AUKT API version 1.0 - rota checada com sucesso!')
})

AukCronBot()


app.listen(process.env.PORT || 3008, () => {
    //console.clear()
    console.log('[AUKT] Server running on PORT: ', process.env.PORT)
})

