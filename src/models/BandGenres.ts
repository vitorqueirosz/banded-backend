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
    genre: { type: Schema.Types.ObjectId, ref: 'Genres', required: true },
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

// bandGenres.virtual('band', {
//   ref: 'Band',
//   localField: 'band',
//   foreignField: '_id',
//   justOne: false,
// });

// bandGenres.virtual('genres', {
//   ref: 'Genre',
//   localField: 'genre',
//   foreignField: '_id',
//   justOne: false,
// });

export const BandGenres = model<BandGenresModel>('BandGenres', bandGenres);
