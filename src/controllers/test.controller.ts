import { Request, Response } from "express";
import redis from "../config/redis";
import mailService from "../services/mail.service";

class TestController {

    public async testRedis(req: Request, res: Response) {
        try {
            await redis.set(
                "test-key",
                "Hello Redis",
                {
                    ex: 60,
                }
            );
            const value = await redis.get("test-key");
            return res.json({ success: true, value, });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Redis Error", });
        }
    }

    public async testMail(req: Request, res: Response) {
        try {
            await mailService.sendEmail(
                "shobhitchoudhary.sourceryit@gmail.com",
                "Brevo Working",
                `
                <h2>Congratulations 🎉</h2>
                <p>
                Brevo is successfully connected.
                </p>
                `
            );
            return res.json({ success: true, message: "Mail Sent", });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Mail Failed", });
        }
    }

}

export default new TestController();