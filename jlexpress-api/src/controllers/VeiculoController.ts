import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import VeiculoModel from '../models/Veiculo';
import UserModel from '../models/User';
import { AppErrors } from "../errors/AppErrors";

class VeiculoController {

    async create(request: Request, response: Response) {

        const {
            placa,
            marca,
            modelo,
            ano,
            renavam,
            cor,
            imagem
        } = request.body;

        const data = {
            placa: placa.toUpperCase(),
            marca,
            modelo,
            ano,
            renavam,
            cor,
            imagem
        };
        const veiculo = await VeiculoModel.create(data)

        return response.status(201).json(veiculo);
    }

    async update(request: Request, response: Response) {
        const {
            id
        } = request.params;

        const veiculo = await VeiculoModel.findByIdAndUpdate(
            { _id: id },
            request.body,
            { new: true }
        );

        return response.status(200).json(veiculo);
    }

    async delete(request: Request, response: Response) {
        const {
            id
        } = request.params;

        await VeiculoModel.findByIdAndDelete(
            { _id: id }
        );

        return response.status(200).json({ msg: 'Veículos excluído com sucesso!' });
    }

    async showAll(request: Request, response: Response) {
        const veiculos = await VeiculoModel.find();

        const newVeiculos = veiculos.map((car: any) => {
            return {
                ...car._doc,
                // imagem: `${process.env.APP_IMAGES_URL}/${car._doc.imagem}`
                imagem: `${car._doc.imagem}`
            }
        })

        return response.status(200).json({ veiculos: newVeiculos });
    }

    async images(request: Request, response: Response) {

        const pathName = path.resolve(__dirname, '..', '..', 'uploads');

        const files = fs.readdirSync(pathName);

        const listImages = files.map(file => {
            const fileName = file.split('.').slice(0, -1).join('.');
            const filePath = `${process.env.APP_IMAGES_URL}/${file}`;

            return { fileName, file, filePath };
        });

        return response.status(200).json({ listImages });
    }

    async getCar(request: Request, response: Response) {
        const { placa } = request.params;

        const newPlaca = placa.toUpperCase();

        const veiculo = await VeiculoModel.findOne({ placa: newPlaca });

        if (!veiculo) throw new AppErrors(`Veículo não encontrado com a placa ${placa}`);

        const newVeiculo = {
            ...veiculo._doc,
            imagem: `${process.env.APP_IMAGES_URL}/${veiculo._doc.imagem}`
        }

        return response.status(200).json({ veiculo: newVeiculo });
    }

    async sendChecklist(request: Request, response: Response) {
        const { values, carFleet, listChecks, fleetWidth } = request.body;

        const { id } = request.user;

        const user = await UserModel.findById({ _id: id })

        if (!user) throw new AppErrors('Usuário não encotrado.');

        const currentDate = format(new Date(), 'dd/MM/y', {
            locale: ptBR
        });

        const newListChecks = listChecks.map((item: { top: number, left: number }) => {
            return {
                ...item,
                top: item.top + 10
            }
        });

        const data = {
            values,
            carFleet,
            listChecks: newListChecks,
            currentDate,
            fleetWidth,
            responsible: user.name
        };

        console.log('Data: ', data);

        return response.status(200).json({ message: 'Checklist enviado com sucesso.' });
    }
}

export { VeiculoController }