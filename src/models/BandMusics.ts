import { model, Schema, Document } from 'mongoose';

export interface BandMusics {
  _id: string;
  name: string;
  genre: string;
  band: string;
  duration: number;
}

interface BandMusicsModel extends Omit<BandMusics, '_id'>, Document {}

const bandMusicsSchema = new Schema({
  name: { type: String, required: true },
  genre: { type: Schema.Types.ObjectId, ref: 'Genres', required: true },
  band: { type: Schema.Types.ObjectId, ref: 'Genres', required: true },
  duration: { type: Number, required: true },
});

export const BandMusics = model<BandMusicsModel>(
  'BandMusics',
  bandMusicsSchema,
);
