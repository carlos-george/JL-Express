import express from 'express';

import auth, { UserReq } from './middlewares/auth';
import { VeiculoController } from './controllers/VeiculoController';
import { UserController } from './controllers/UserController';

declare global {
    namespace Express {
        interface Request {
            user: UserReq
        }
    }
}

const routes = express.Router();

const veiculoController = new VeiculoController();
const userController = new UserController();

// Roues for Veiculos

routes.get('/veiculos', auth, veiculoController.showAll);
routes.get('/veiculos/:placa', auth, veiculoController.getCar);
routes.post('/veiculos', auth, veiculoController.create);
routes.put('/veiculos/:id', auth, veiculoController.update);
routes.delete('/veiculos/:id', auth, veiculoController.delete);
routes.post('/enviar-checklist', auth, veiculoController.sendChecklist);

//Layouts dos veiculos imagens
routes.get('/layouts', auth, veiculoController.images);

///Users
routes.post('/users', userController.create);
routes.put('/users/generate-pass/:id', auth, userController.generatepass);
routes.put('/users/reset-pass/:id', auth, userController.resetPassword);
routes.put('/users/active-desactive/:id', auth, userController.activeDesactiveUser);
routes.post('/users/authenticate', userController.authenticate);
routes.get('/users/profile', auth, userController.getUser);
routes.get('/users', auth, userController.showAll);
routes.delete('/users/:id', auth, userController.deleteUser);

export default routes;