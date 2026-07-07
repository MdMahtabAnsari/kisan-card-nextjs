import nodemailer, { type Transporter } from "nodemailer";

export class EmailService {
    private static instance: EmailService;
    private transporter: Transporter | null = null;

    private constructor() {}

    static getInstance(): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }

        return EmailService.instance;
    }

    private getTransporter(): Transporter {
        if (this.transporter) {
            return this.transporter;
        }

        if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
            throw new Error("SMTP host or port is not set");
        }

        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465,
            ...(process.env.SMTP_USER &&
                process.env.SMTP_PASSWORD && {
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASSWORD,
                    },
                }),
        });

        return this.transporter;
    }

    async sendEmail({
                        to,
                        subject,
                        text,
                        html,
                    }: {
        to: string;
        subject: string;
        text?: string;
        html?: string;
    }) {
        try {
            const transporter = this.getTransporter();

            const info = await transporter.sendMail({
                from: process.env.SMTP_FROM,
                to,
                subject,
                text,
                html,
            });

            console.log(`Email sent to ${to}`);

            return {
                success: true,
                messageId: info.messageId,
            };
        } catch (error) {
            console.error("Email sending error:", error);

            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to send email",
            };
        }
    }
}

export const emailService = EmailService.getInstance();