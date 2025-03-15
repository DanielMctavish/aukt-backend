import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import helmet from 'helmet';
import '../aukontroller/MainAukController';
import adminRoutes from './routes/AdminRoutes';
import advertiserRoutes from './routes/AdvertiserRoutes';
import auctRoutes from './routes/AuctRoutes';
import auctDatesRoutes from './routes/AuctDatesRoutes';
import clientRoutes from './routes/ClientRoutes';
import creditRoutes from './routes/CreditCardRoutes';
import productRoutes from './routes/ProductRoutes';
import moderatorRoutes from './routes/ModeratorRoutes';
import cartelaRoutes from './routes/CartelaRoutes';
import transactionRoutes from './routes/TransactionRoutes';
import templateRoutes from './routes/TemplateRoutes';
import { currentCategorieData } from '../categories/categoriesLibrary';

const app = express();

// Middlewares básicos
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configuração do Helmet para segurança
app.use(
  helmet({
    frameguard: { action: 'deny' }, 
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], 
        scriptSrc: ["'self'"], 
        styleSrc: ["'self'"], 
        imgSrc: ["'self'", 'data:'], 
        connectSrc: ["'self'", 'https://aukt.com.br'], 
      },
    },
  })
);

// Configuração do CORS restrita ao frontend
app.use(
  cors({
    origin: 'https://aukt.com.br', 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
  })
);

// Rotas
app.use('/admin', adminRoutes);
app.use('/advertiser', advertiserRoutes);
app.use('/auct', auctRoutes);
app.use('/auct-dates', auctDatesRoutes);
app.use('/client', clientRoutes);
app.use('/credit-card', creditRoutes);
app.use('/products', productRoutes);
app.use('/moderator', moderatorRoutes);
app.use('/cartela', cartelaRoutes);
app.use('/transaction', transactionRoutes);
app.use('/template', templateRoutes);

// Rotas de teste
app.get('/', (req, res) => {
  res.send('AUKT API version 1.0 - changes');
});

app.get('/check-api', (req, res) => {
  res.send('AUKT API version 1.0 - rota checada com sucesso!');
});

app.get('/category', (req, res) => {
  res.status(200).json(currentCategorieData);
});

// Inicia o servidor
app.listen(3008, () => {
  console.clear();
  console.log('[AUKT] Server running on PORT: ', 3008);
});