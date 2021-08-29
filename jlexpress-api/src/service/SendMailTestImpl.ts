import nodemailer, { Transporter } from "nodemailer";
import { join, resolve } from 'path';
import fs from 'fs';
import handlebars from "handlebars";
import pdf from 'html-pdf';
import { AppErrors } from '../errors/AppErrors';
import SendMail, { Data } from "./SendMail";


class SendMailTestImpl implements SendMail {

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

        const orcaMailPath = resolve(process.cwd(), 'src/views/email');

        const templateFileContent = fs.readFileSync(join(orcaMailPath, 'checklist.hbs'), 'utf8');

        const mailTemplateParse = handlebars.compile(templateFileContent);

        const html = mailTemplateParse(data);

        const message = await client.sendMail({
            to: process.env.USERMAIL ? process.env.USERMAIL : 'contatodf@jlexpress.com.br',
            subject: 'Checklist',
            html,
            from: process.env.USERMAIL ? process.env.USERMAIL : 'contatodf@jlexpress.com.br',
        });

        console.log('Message sent: %s', message.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }

    async createPDF(html: string) {

        const options = {
            type: 'pdf',
            format: 'A4',
            orientation: 'portrait'
        }

        pdf.create(html).toStream((err, stream) => {
            if (err) return new AppErrors(err.message);

            stream.pipe(fs.createWriteStream('./foo.pdf'));
        });

    }
}

export default new SendMailTestImpl();


