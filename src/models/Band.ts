import { model, Schema, Document } from 'mongoose';
import { BandAlbums } from './BandAlbums';
import { BandGenres } from './BandGenres';
import { BandMembers } from './BandMembers';
import { BandMusics } from './BandMusics';

export interface Band {
  _id?: string;
  name: string;
  image: string;
  owner: string;
  city: string;
  musics: BandMusics[];
  genres: BandGenres[];
  members: BandMembers[];
  albums: BandAlbums[];
}

export interface BandModel extends Omit<Band, '_id'>, Document {}

const bandSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    city: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    genres: [
      { type: Schema.Types.ObjectId, ref: 'BandGenres', required: true },
    ],
    musics: [
      { type: Schema.Types.ObjectId, ref: 'BandMusics', required: true },
    ],
    albums: [
      { type: Schema.Types.ObjectId, ref: 'BandAlbums', required: true },
    ],
    members: [
      { type: Schema.Types.ObjectId, ref: 'BandMembers', required: true },
    ],
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

// bandSchema.virtual('genre', {
//   ref: 'BandGenres',
//   localField: '_id',
//   foreignField: 'band',
//   justOne: false,
// });

// bandSchema.virtual('musics', {
//   ref: 'BandMusics',
//   localField: '_id',
//   foreignField: 'band',
//   justOne: false,
// });

// bandSchema.virtual('members', {
//   ref: 'BandMembers',
//   localField: '_id',
//   foreignField: 'band',
//   justOne: false,
// });

export const Band = model<BandModel>('Band', bandSchema);
