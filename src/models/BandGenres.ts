import { model, Schema, Document } from 'mongoose';

export interface BandGenres {
  _id: string;
  band: string;
  genre: string;
}

interface BandGenresModel extends Omit<BandGenres, '_id'>, Document {}

const bandGenres = new Schema({
  band: { type: Schema.Types.ObjectId, ref: 'Band', required: true },
  genre: { type: Schema.Types.ObjectId, ref: 'Genres', required: true },
});

export const BandGenres = model<BandGenresModel>('BandGenres', bandGenres);
