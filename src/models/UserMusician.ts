/* eslint-disable no-shadow */

import mongoose, { Document, model, Schema } from 'mongoose';
import { Band } from './Band';
import { User } from './User';
import { UserMusics } from './UserMusics';

export interface UserMusician {
  _id?: string;
  user: User;
  function: string;
  bands: Band[];
  bandsName: string[];
  musics: UserMusics[];
}

export interface UserMusicianModel
  extends Omit<UserMusician, '_id'>,
    Document {}

const userMusicianSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    function: { type: String, required: true },
    bands: [{ type: Schema.Types.ObjectId, ref: 'Band', required: false }],
    bandsName: [{ type: String, required: false }],
    musics: [
      { type: Schema.Types.ObjectId, ref: 'UserMusics', required: false },
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
