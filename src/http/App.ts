import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { json } from 'body-parser'

import adminRoutes from './routes/AdminRoutes'
import advertiserRoutes from './routes/AdvertiserRoutes'
import auctRoutes from './routes/AuctRoutes'
import clientRoutes from './routes/ClientRoutes'
import creditRoutes from './routes/CreditCardRoutes'
import productRoutes from './routes/ProductRoutes'

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(json())


app.use('/admin', adminRoutes)
app.use('/advertiser', advertiserRoutes)
app.use('/auct', auctRoutes)
app.use('/client', clientRoutes)
app.use('/credit-card', creditRoutes)
app.use('/products', productRoutes)

app.use('/', (req, res) => {
    res.send('AUKT API version 1.0')
})


app.listen(process.env.PORT || 3008, () => {
    console.log('[DM] Server running on PORT: ', process.env.PORT)
})

export default app