import express from "express";
import { register, login } from "../controllers/userController.js";

const router = express.Router();

/**
 * @swagger
 * /api/sensors/users/register:
 *   post:
 *     summary: Đăng ký tài khoản
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */
router.post("/register", register);

/**
 * @swagger
 * /api/sensors/users/login:
 *   post:
 *     summary: Đăng nhập và lấy JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công và trả token
 */
router.post("/login", login);

export default router;
