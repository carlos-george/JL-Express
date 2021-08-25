import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as yup from 'yup';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import UserModel from '../models/User';
import { AppErrors } from '../errors/AppErrors';

const generateToken = (params = {}) => {
    return jwt.sign(params,
        process.env.JWT_KEY!,
        {
            // 24hrs
            expiresIn: 86400
            // 4hrs
            // expiresIn: 14400
            // expiresIn: 2

        });
}

class UserController {

    async create(request: Request, response: Response) {

        const { username, name, birthday } = request.body;

        const schema = yup.object().shape({
            username: yup.string().required(),
            name: yup.string().required(),
            birthday: yup.string().required(),
        });

        await schema.validate(request.body, { abortEarly: false });

        const birthdayPass = birthday.split('-');

        const newpass = `JL@${birthdayPass[2]}${birthdayPass[1]}${birthdayPass[0]}`;

        const passHash = await bcrypt.hash(newpass, 10);

        const userAlreadyExists = await UserModel.findOne({ username });

        if (userAlreadyExists) throw new AppErrors('Usuário já existente!');

        const user = await UserModel.create({
            username,
            name,
            password: passHash,
            birthday: parseISO(birthday),
            isActive: true
        });

        delete user._doc.password;

        return response.status(201).json({ message: 'Usuário criado com sucesso', user });

    }

    async resetPassword(request: Request, response: Response) {
        const { current, newpass } = request.body;
        const { id } = request.params;

        const schema = yup.object().shape({
            current: yup.string().required(),
            newpass: yup.string().required(),
        });

        await schema.validate(request.body, { abortEarly: false });

        const user = await UserModel.findById({ _id: id });

        if (!user) throw new AppErrors('Usuário não existe!');

        if (!await bcrypt.compare(current, user.password)) throw new AppErrors('Senha inválida para o usuário.');

        const passHash = await bcrypt.hash(newpass, 10);

        await UserModel.findByIdAndUpdate(
            { _id: id },
            { password: passHash }
        );

        return response.status(200).json({ message: 'Senha alterada com sucesso.' });

    }

    async generatepass(request: Request, response: Response) {

        const { id } = request.params;

        const user = await UserModel.findById({ _id: id });

        if (!user) throw new AppErrors('Usuário não existe!');

        const currentDate = format(new Date(), 'dd/MM/y', {
            locale: ptBR
        }).split('/');

        const newpass = `JL@${currentDate[0]}${currentDate[1]}${currentDate[2]}`;

        const passHash = await bcrypt.hash(newpass, 10);

        await UserModel.findByIdAndUpdate(
            { _id: id },
            { password: passHash }
        );

        return response.status(200).json({ message: 'Senha gerada com sucesso.' });

    }

    async deleteUser(request: Request, response: Response) {

        const { id } = request.params;

        await UserModel.findByIdAndRemove({ _id: id });

        return response.status(200).json({ message: 'Usuário excluído com sucesso.' });

    }

    async activeDesactiveUser(request: Request, response: Response) {

        const { id } = request.params;

        const user = await UserModel.findById({ _id: id });

        if (!user) throw new AppErrors('Usuário não existe!');

        const newUser = await UserModel.findByIdAndUpdate(
            { _id: id },
            { isActive: !user.isActive },
            { new: true }
        );

        const message = newUser.isActive ? 'Usuário ativado com sucesso.' : 'Usuário desativado com sucesso.';

        return response.status(200).json({ message });
    }

    async authenticate(request: Request, response: Response) {

        const { username, password } = request.body;

        const userAlreadyExists = await UserModel.findOne({ username, isActive: true });

        if (!userAlreadyExists) throw new AppErrors('Usuário não existe!');

        if (!await bcrypt.compare(password, userAlreadyExists.password)) throw new AppErrors('Senha inválida para o usuário.');

        delete userAlreadyExists._doc.password;

        return response.json({ user: userAlreadyExists, token: generateToken({ id: userAlreadyExists._id }) });

    }

    async getUser(request: Request, response: Response) {

        const { id } = request.user;

        const userExists = await UserModel.findById({ _id: id });

        if (!userExists) throw new AppErrors('Usuário não existe!');

        delete userExists._doc.password;

        return response.json({ user: userExists });

    }

    async showAll(request: Request, response: Response) {
        const { username } = request.query;

        const rgx = (pattern: string) => new RegExp(`^${pattern}`, 'i');
        const searchRgx = rgx(username as string);

        const listUsers = await UserModel.find({ username: { $regex: searchRgx } }, '_id username birthday isActive');

        return response.json({ users: listUsers });
    }
}

export { UserController };
