import mongoose, { Document, model, Schema } from 'mongoose';
import { UserMusics } from './UserMusics';

export interface UserAlbums {
  _id?: string;
  user: string;
  album_image: string;
  album_name: string;
  year_release: number;
  musics: UserMusics[];
}

export interface UserAlbumsModel extends Omit<UserAlbums, '_id'>, Document {}

const schema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    album_image: { type: String, required: true },
    album_name: { type: String, required: true },
    year_release: { type: String, required: true },
    musics: [{ type: String, ref: 'UserMusics', required: true }],
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

export const UserAlbums = model<UserAlbumsModel>('UserAlbums', schema);
