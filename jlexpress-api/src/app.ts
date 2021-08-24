import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import mongoose from 'mongoose';
import path from 'path';

import routes from './routes';
import errorHandler from './errors/handle';

// iniciando o app / servidor
const app = express();
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

/**
 * Conexão ao Banco de Dados
 */
const dbConnection = process.env.TS_NODE_DEV
    ? 'mongodb://root:root@localhost:27017/jlexpress?authSource=admin'
    : process.env.DB_CONNECTION;

console.log("Iniciando conexão ao MongoDB...");

mongoose.connect(
    dbConnection!,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) {
            console.error(`Erro na conexão ao MongoDB - ${err}`);
        }
    }
);

// Rotas
app.use("/api", routes);
app.use(errorHandler);

export { app }