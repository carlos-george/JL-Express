import { app } from './app';
import { connection } from 'mongoose';

connection.once("open", async () => {
    console.log("Conectado ao MongoDB");
    //connection.db.collection('veiculos').update({}, { $set: { "imagem": "" } }, { upsert: false, multi: true });

    // await connection.db.collection('veiculos').insertMany(veiculos);
    /**
     * Definição de porta e
     * inicialização do app
     */
    const APP_PORT = process.env.PORT || 3001;
    app.listen(APP_PORT, () => {
        console.log(`Servidor iniciado na porta ${APP_PORT}`);
    });
});