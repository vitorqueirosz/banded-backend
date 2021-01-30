import { Schema, model, Document } from 'mongoose';

export interface Genre {
  _id?: string;
  name: string;
}

interface GenreModel extends Omit<Genre, '_id'>, Document {}

const genreSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const Genre = model<GenreModel>('Genre', genreSchema);
