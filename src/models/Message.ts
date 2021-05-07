import { Schema, model, Document } from 'mongoose';

export interface Message {
  _id?: string;
  userReceivingId: string;
  user: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageModel extends Omit<Message, '_id'>, Document {}

const messageSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userReceivingId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const Message = model<MessageModel>('Message', messageSchema);
