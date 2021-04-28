/* eslint-disable no-shadow */

import mongoose, { Document, model, Schema } from 'mongoose';
import { Band } from './Band';
import { User } from './User';
import { UserAlbums } from './UserAlbums';
import { UserMusics } from './UserMusics';

export interface UserMusician {
  _id?: string;
  user: string;
  instrument: string;
  bands: Band[];
  bandsName: string[];
  musics: UserMusics[];
  albums: UserAlbums[];
}

export interface UserMusicianModel
  extends Omit<UserMusician, '_id'>,
    Document {}

const userMusicianSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    instrument: { type: String, required: false },
    bands: [{ type: Schema.Types.ObjectId, ref: 'Band', required: false }],
    bandsName: [{ type: String, required: false }],
    musics: [
      { type: Schema.Types.ObjectId, ref: 'UserMusics', required: false },
    ],
    albums: [
      { type: Schema.Types.ObjectId, ref: 'UserAlbums', required: false },
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

export const UserMusician = model<UserMusicianModel>(
  'UserMusician',
  userMusicianSchema,
);
