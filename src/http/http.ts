import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { json } from 'body-parser'
import '../aukontroller/MainAukController'
import adminRoutes from './routes/AdminRoutes'
import advertiserRoutes from './routes/AdvertiserRoutes'
import auctRoutes from './routes/AuctRoutes'
import auctDatesRoutes from './routes/AuctDatesRoutes'; // Importando as rotas de AuctDates
import clientRoutes from './routes/ClientRoutes'
import creditRoutes from './routes/CreditCardRoutes'
import productRoutes from './routes/ProductRoutes'
import moderatorRoutes from "./routes/ModeratorRoutes"
import cartelaRoutes from "./routes/CartelaRoutes"
import transactionRoutes from "./routes/TransactionRoutes"
import { currentCategorieData } from '../categories/categoriesLibrary'

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
app.use('/auct-dates', auctDatesRoutes)
app.use('/client', clientRoutes)
app.use('/credit-card', creditRoutes)
app.use('/products', productRoutes)
app.use('/moderator', moderatorRoutes)
app.use('/cartela', cartelaRoutes)
app.use('/transaction', transactionRoutes)

app.get('/', (req, res) => {
    res.send('AUKT API version 1.0 - changes')
})

app.get('/check-api', (req, res) => {
    res.send('AUKT API version 1.0 - rota checada com sucesso!')
})

app.get('/category', (req, res) => {
    res.status(200).json(currentCategorieData)
})

app.listen(3008, () => {
    console.clear()
    console.log('[AUKT] Server running on PORT: ', 3008)
})

