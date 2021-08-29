import nodemailer, { Transporter } from "nodemailer";
import { join, resolve } from 'path';
import fs from 'fs';
import handlebars from "handlebars";
import pdf from 'html-pdf';
import { AppErrors } from '../errors/AppErrors';
import SendMail, { Data } from "./SendMail";


export default class SendMailGmailImpl implements SendMail {

    async execute(data: Data) {

        const host = process.env.MAILHOST

        const client: Transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: process.env.USERMAIL,
                pass: process.env.USERPASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        const orcaMailPath = resolve(process.cwd(), 'src/views/email');

        const templateFileContent = fs.readFileSync(join(orcaMailPath, 'checklist.hbs'), 'utf8');

        const mailTemplateParse = handlebars.compile(templateFileContent);

        const html = mailTemplateParse(data);

        const message = await client.sendMail({
            to: process.env.USERMAIL,
            subject: 'Checklist',
            html,
            from: process.env.USERMAIL,
        });

        console.log('Message sent: %s', message.messageId);
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


