import { Schema, model, Document } from 'mongoose';

export interface Genre {
  _id: string;
  name: string;
}

interface GenreModel extends Omit<Genre, '_id'>, Document {}

const genreSchema = new Schema({
  name: { type: String, required: true },
});

export const Genre = model<GenreModel>('Genre', genreSchema);
