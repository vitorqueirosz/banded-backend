import { model, Schema, Document } from 'mongoose';

export interface BandGenres {
  _id: string;
  band: string;
  genre: string;
}

interface BandGenresModel extends Omit<BandGenres, '_id'>, Document {}

const bandGenres = new Schema(
  {
    band: { type: Schema.Types.ObjectId, ref: 'Band', required: true },
    genre: { type: Schema.Types.ObjectId, ref: 'Genre', required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
      virtuals: true,
    },
  },
);

export const BandGenres = model<BandGenresModel>('BandGenres', bandGenres);
