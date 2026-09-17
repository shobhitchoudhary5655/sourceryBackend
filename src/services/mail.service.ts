import nodemailer from "nodemailer";

class MailService {

    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            // secure: false,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        console.log({
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_USER: process.env.SMTP_USER,
            BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
        });
    }

    public async sendEmail(to: string, subject: string, html: string): Promise<void> {
        await this.transporter.sendMail({
            from: `"${process.env.BREVO_SENDER_NAME}" <${process.env.BREVO_SENDER_EMAIL}>`,
            to,
            subject,
            html,
        });
    }

    public async sendForgotPasswordEmail(email: string, name: string, resetLink: string): Promise<void> {
        const html = `
    <div style="font-family:Arial,sans-serif;padding:20px">

        <h2>Hello ${name},</h2>

        <p>
            We received a request to reset your password.
        </p>

        <p>
            Click the button below to reset your password.
        </p>

        <a
            href="${resetLink}"
            style="
                display:inline-block;
                padding:12px 24px;
                background:#7F26FD;
                color:white;
                text-decoration:none;
                border-radius:6px;
            "
        >
            Reset Password
        </a>

        <p style="margin-top:20px">
            This link will expire in <b>10 minutes</b>.
        </p>

        <p>
            If you didn't request this, simply ignore this email.
        </p>

    </div>
    `;

        await this.sendEmail(email, "Reset Your Password", html);
    }

    public async sendPasswordChangedMail(email: string, name: string,): Promise<void> {
        const now = new Date();
        const date = now.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric", });
        const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", });

        const html = `
                <!DOCTYPE html>
                    <html>
                        <head>
                            <meta charset="UTF-8">
                        </head>

                        <body style="margin:0;padding:0;background:#F5F7FB;font-family:Arial,sans-serif;">

                        <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                        <td align="center">

                        <table
                            width="600"
                            cellpadding="0"
                            cellspacing="0"
                            style="background:#ffffff;border-radius:10px;overflow:hidden;margin-top:30px;">

                            <tr>
                                <td
                                    style="
                                    background:#7F26FD;
                                    padding:25px;
                                    text-align:center;
                                    color:#fff;
                                    font-size:24px;
                                    font-weight:bold;
                                ">
                                  Sourcery IT
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:35px;">

                                    <h2 style="margin-top:0;color:#333;">
                                      Password Reset Successful
                                    </h2>

                                    <p style="font-size:15px;color:#555;">
                                        Hello <strong>${name}</strong>,
                                    </p>

                                    <p style="font-size:15px;color:#555;line-height:24px;">
                                        Your Sourcery IT account password has been changed successfully.
                                    </p>

                                    <p style="font-size:15px;color:#555;line-height:24px;">
                                       If you made this change, no further action is required.
                                    </p>

                                    <p style="font-size:15px;color:#D32F2F;font-weight:bold;">
                                        If you did NOT reset your password,please contact your administrator immediatelyor reset your password again.
                                    </p>

                                    <table
                                        width="100%"
                                        style="
                                        background:#F8F8F8;
                                        border-radius:8px;
                                        padding:15px;
                                        margin-top:20px;
                                    ">

                                        <tr>
                                            <td><b>Date</b></td>
                                            <td>${date}</td>
                                        </tr>

                                        <tr>
                                            <td><b>Time</b></td>
                                            <td>${time}</td>
                                        </tr>

                                    </table>

                                    <p
                                        style="
                                        margin-top:35px;
                                        color:#555;
                                        line-height:24px;
                                    ">
                                       Thank you,
                                        <br/>
                                        <strong>Sourcery IT Team</strong>
                                    </p>

                                </td>

                            </tr>

                            <tr>
                                <td
                                    style="
                                    background:#F3F3F3;
                                    padding:15px;
                                    text-align:center;
                                    font-size:12px;
                                    color:#777;
                                ">
                                    This is an automated email.Please do not reply.
                                </td>
                            </tr>
                        </table>
                        </td>
                        </tr>
                        </table>
                        </body>
                    </html>
                `;
        await this.sendEmail(email, "Password Reset Successful", html);
    }

}

export default new MailService();