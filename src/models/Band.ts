import { model, Schema, Document } from 'mongoose';

export interface Band {
  _id: string;
  name: string;
  image: string;
  owner: string;
  city: string;
  musics?: string[];
  genres?: string[];
  members?: string[];
}

export interface BandModel extends Omit<Band, '_id'>, Document {}

const bandSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    city: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    genres: [{ type: Schema.Types.ObjectId, ref: 'Genre', required: true }],
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

// bandSchema.virtual('ownerBand', {
//   ref: 'User',
//   localField: 'owner',
//   foreignField: '_id',
//   justOne: true,
// });

bandSchema.virtual('genre', {
  ref: 'BandGenres',
  localField: '_id',
  foreignField: 'band',
  justOne: false,
});

bandSchema.virtual('musics', {
  ref: 'BandMusics',
  localField: '_id',
  foreignField: 'band',
  justOne: false,
});

bandSchema.virtual('members', {
  ref: 'Member',
  localField: '_id',
  foreignField: 'band',
  justOne: false,
});

export const Band = model<BandModel>('Band', bandSchema);
