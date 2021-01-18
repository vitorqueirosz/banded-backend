/* eslint-disable no-shadow */

import mongoose, { Document, model } from 'mongoose';

import AuthService from '@src/services/authService';

export interface User {
  _id?: string;
  name: string;
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

// eslint-disable-next-line func-names
schema.pre<UserModel>('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) {
    return;
  }

  try {
    const hashedPassword = await AuthService.hashPassword(this.password);

    this.password = hashedPassword;
  } catch (error) {
    console.error(`Error hashing the password for the user: ${this.name}`);
  }
});

export const User = model<UserModel>('User', schema);
