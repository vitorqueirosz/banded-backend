import mongoose, { Document, model, Schema } from 'mongoose';

export interface UserMusics {
  _id?: string;
  user: string;
  album_image: string;
  album_name: string;
  music_name: string;
  artist_name: string;
  duration_ms: string;
}

export interface UserMusicsModel extends Omit<UserMusics, '_id'>, Document {}

const schema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    music_name: { type: String, required: true },
    duration_ms: { type: String, required: true },
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

export const UserMusics = model<UserMusicsModel>('UserMusics', schema);
