import { NextApiRequest, NextApiResponse } from "next";
import SendMailService from "../../services/SendMailService";


type Data = {
    msg?: string,
    error?: string
}

export default async function send(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { nome, email, telefone, assunto, mensagem } = req.body;

    const data = {
        nome,
        email,
        telefone,
        assunto,
        mensagem
    }
    try {
        await SendMailService.execute(data);
        res.json({ msg: 'Solicitação enviada com sucesso!' });
    } catch (error) {
        console.error(error);
        throw Error('Erro no envio da solicitação.');
    }

}