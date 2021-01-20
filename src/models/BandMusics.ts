import { model, Schema, Document } from 'mongoose';
import { Genre } from './Genre';

export interface BandMusics {
  _id: string;
  name: string;
  genre: Genre;
  band: string;
  duration: number;
}

interface BandMusicsModel extends Omit<BandMusics, '_id'>, Document {}

const bandMusicsSchema = new Schema(
  {
    name: { type: String, required: true },
    genre: { type: Schema.Types.ObjectId, ref: 'Genres', required: true },
    band: { type: Schema.Types.ObjectId, ref: 'Genres', required: true },
    duration: { type: Number, required: true },
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

export const BandMusics = model<BandMusicsModel>(
  'BandMusics',
  bandMusicsSchema,
);
