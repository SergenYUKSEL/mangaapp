import jwt from "jsonwebtoken";
import { z } from "zod";
import User, { IUser, UserRole } from "../models/user.model";
import { AppError } from "../middlewares/error.middleware";
import { SignOptions } from "jsonwebtoken";

// Validation schema for registration
export const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
});

// Validation schema for login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
  };
  token: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(
    userData: z.infer<typeof registerSchema>
  ): Promise<AuthResponse> {
    // Validate input data
    const validatedData = registerSchema.parse(userData);

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: validatedData.email },
        { username: validatedData.username },
      ],
    });

    if (existingUser) {
      throw new AppError(
        "User with this email or username already exists",
        409
      );
    }

    // Create new user
    const newUser = await User.create({
      username: validatedData.username,
      email: validatedData.email,
      password: validatedData.password,
      role: UserRole.USER,
    });

    // Generate JWT token
    const token = this.generateToken(newUser);

    return {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    };
  }

  /**
   * Login an existing user
   */
  async login(loginData: z.infer<typeof loginSchema>): Promise<AuthResponse> {
    // Validate input data
    const validatedData = loginSchema.parse(loginData);

    // Find user by email
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Generate JWT token for a user
   * @private
   */
  private generateToken(user: IUser): string {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const secret = process.env.JWT_SECRET || "your_jwt_secret_key";
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    return jwt.sign(payload, secret, { expiresIn } as SignOptions);
  }
}

export default new AuthService();
