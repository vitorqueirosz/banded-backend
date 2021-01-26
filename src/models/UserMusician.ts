/* eslint-disable no-shadow */

import mongoose, { Document, model, Schema } from 'mongoose';
import { UserMusics } from './UserMusics';

export interface UserMusician {
  _id?: string;
  user: string;
  function: string;
  band: string;
  bandName: string;
  musics: UserMusics[];
}

export interface UserMusicianModel
  extends Omit<UserMusician, '_id'>,
    Document {}

const userMusicianSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'UserMusician', required: false },
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
