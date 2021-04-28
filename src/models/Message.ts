import { Schema, model, Document } from 'mongoose';

export interface Message {
  _id?: string;
  chatId: string;
  user: string;
  text: string;
}

interface MessageModel extends Omit<Message, '_id'>, Document {}

const messageSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    chatId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
