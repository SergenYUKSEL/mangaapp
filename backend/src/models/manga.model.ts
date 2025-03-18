import mongoose, { Document, Schema } from "mongoose";

// Enum for manga genres
export enum MangaGenre {
  SEINEN = "seinen",
  SHOJO = "shojo",
  SHONEN = "shonen",
  JOSEI = "josei",
  KODOMO = "kodomo",
  ACTION = "action",
  ADVENTURE = "adventure",
  COMEDY = "comedy",
  DRAMA = "drama",
  FANTASY = "fantasy",
  HORROR = "horror",
  MYSTERY = "mystery",
  ROMANCE = "romance",
  SCIFI = "sci-fi",
  SLICE_OF_LIFE = "slice-of-life",
  SPORTS = "sports",
  SUPERNATURAL = "supernatural",
  THRILLER = "thriller",
  HISTORICAL = "historical",
  PSYCHOLOGICAL = "psychological",
}

// Enum for reading status
export enum ReadingStatus {
  UNREAD = "unread",
  READING = "reading",
  COMPLETED = "completed",
  ON_HOLD = "on-hold",
  DROPPED = "dropped",
}

// Enum for ownership status
export enum OwnershipStatus {
  OWNED = "owned",
  WANTED = "wanted",
  NONE = "none",
}

// Interface for author
export interface IAuthor {
  name: string;
  role?: string;
}

// Interface for the Manga document
export interface IManga extends Document {
  mangaDexId: string;
  title: string;
  alternativeTitles?: string[];
  description?: string;
  genres: MangaGenre[];
  authors: IAuthor[];
  coverImage?: string;
  status?: string;
  year?: number;
  rating?: number;
  isbn?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for the Manga model
const MangaSchema: Schema = new Schema(
  {
    mangaDexId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    alternativeTitles: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
    },
    genres: {
      type: [String],
      enum: Object.values(MangaGenre),
      default: [],
    },
    authors: [
      {
        name: {
          type: String,
          required: true,
        },
        role: {
          type: String,
        },
      },
    ],
    coverImage: {
      type: String,
    },
    status: {
      type: String,
    },
    year: {
      type: Number,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
    },
    isbn: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
MangaSchema.index({ title: "text", "authors.name": "text" });

export default mongoose.model<IManga>("Manga", MangaSchema);
