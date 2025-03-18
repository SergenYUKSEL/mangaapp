import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { OwnershipStatus, ReadingStatus } from "./manga.model";

// Enum for user roles
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

// Interface for user's manga collection item
export interface IUserMangaItem {
  mangaId: mongoose.Types.ObjectId;
  ownershipStatus: OwnershipStatus;
  readingStatus: ReadingStatus;
  rating?: number;
  notes?: string;
  addedAt: Date;
}

// Interface for the User document
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  mangaCollection: IUserMangaItem[];
  createdAt: Date;
  updatedAt: Date;
  isModified(path: string): boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema for a user's manga collection item
const UserMangaItemSchema: Schema = new Schema({
  mangaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manga",
    required: true,
  },
  ownershipStatus: {
    type: String,
    enum: Object.values(OwnershipStatus),
    default: OwnershipStatus.NONE,
  },
  readingStatus: {
    type: String,
    enum: Object.values(ReadingStatus),
    default: ReadingStatus.UNREAD,
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
  },
  notes: {
    type: String,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Schema for the User model
const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    mangaCollection: [UserMangaItemSchema],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    // Generate salt and hash
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Create text index for searching by username or email
UserSchema.index({ username: "text", email: "text" });

export default mongoose.model<IUser>("User", UserSchema);
