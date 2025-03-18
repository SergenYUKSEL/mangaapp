import { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "../services/auth.service";
import authService from "../services/auth.service";
import { asyncHandler } from "../middlewares/error.middleware";

class AuthController {
  /**
   * Register a new user
   * @route POST /api/auth/register
   */
  register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userData = registerSchema.parse(req.body);
        const result = await authService.register(userData);

        res.status(201).json({
          success: true,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * Login an existing user
   * @route POST /api/auth/login
   */
  login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loginData = loginSchema.parse(req.body);
        const result = await authService.login(loginData);

        res.status(200).json({
          success: true,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );
}

export default new AuthController();
