import { BandMusic } from '@src/services/FindBandByFiltersService';
import { model, Schema, Document } from 'mongoose';
import { Genre } from './Genre';

export interface BandAlbums {
  _id?: string;
  name: string;
  genre: Genre;
  image: string;
  band: string;
  year_release: number;
  musics: BandMusic[];
}

interface BandAlbumsModel extends Omit<BandAlbums, '_id'>, Document {}

const bandAlbumsSchema = new Schema(
  {
    name: { type: String, required: true },
    genre: { type: Schema.Types.ObjectId, ref: 'Genre', required: true },
    band: { type: Schema.Types.ObjectId, ref: 'Band', required: true },
    image: { type: String, required: false },
    year_release: { type: Number, required: true },
    musics: [
      { type: Schema.Types.ObjectId, ref: 'BandMusics', required: true },
    ],
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

export const BandAlbums = model<BandAlbumsModel>(
  'BandAlbums',
  bandAlbumsSchema,
);
