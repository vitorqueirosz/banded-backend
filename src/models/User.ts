/* eslint-disable no-shadow */

import mongoose, { Document, model } from 'mongoose';

import AuthService from '@src/services/authService';

export interface User {
  _id?: string;
  name: string;
  avatar: string;
  email: string;
  password: string;
  city: string;
}

export interface UserModel extends Omit<User, '_id'>, Document {}

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED',
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
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

schema.path('email').validate(
  async (email: string) => {
    const emailExists = await mongoose.models.User.countDocuments({ email });
    return !emailExists;
  },
  'already exists in the database.',
  CUSTOM_VALIDATION.DUPLICATED,
);

export const User = model<UserModel>('User', schema);
