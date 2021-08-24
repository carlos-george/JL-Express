import mongoose from 'mongoose';

const VeiculoSchema = new mongoose.Schema({

    placa: {
        type: String,
        required: true
    },
    marca: {
        type: String,
        required: true
    },
    modelo: {
        type: String,
        required: true
    },
    ano: {
        type: String,
        required: true
    },
    renavam: {
        type: String,
        required: true
    },
    cor: {
        type: String,
        required: true
    },
    imagem: {
        type: String
    }
});

export default mongoose.model('Veiculo', VeiculoSchema);