import { Router } from "express";
import TestController from "../controllers/test.controller";

const router = Router();

router.get("/redis", TestController.testRedis);
router.get("/mail", TestController.testMail);

export default router;