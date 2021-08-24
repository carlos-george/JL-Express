import nodemailer, { Transporter } from "nodemailer";
import { join, resolve } from 'path';
import fs from 'fs';
import handlebars from "handlebars";
import { throws } from "assert";

type Data = {
    nome: string,
    email: string,
    telefone: string,
    assunto: string,
    mensagem: string
}

class SendMailService {

    async execute(data: Data) {

        const client: Transporter = await nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                },
                logger: false,
                debug: false // include SMTP traffic in the logs
            });
            return transporter;
        });

        const orcaMailPath = resolve(process.cwd(), 'src/views/emails');

        const templateFileContent = fs.readFileSync(join(orcaMailPath, 'orcamentoMail.hbs'), 'utf8');

        const mailTemplateParse = handlebars.compile(templateFileContent);

        const html = mailTemplateParse(data);

        const message = await client.sendMail({
            to: process.env.USERMAIL ? process.env.USERMAIL : 'contatodf@jlexpress.com.br',
            subject: data.assunto ? data.assunto : 'Orçamento',
            html,
            from: process.env.USERMAIL ? process.env.USERMAIL : 'contatodf@jlexpress.com.br',
            replyTo: data.email
        });

        console.log('Message sent: %s', message.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}

export default new SendMailService();


