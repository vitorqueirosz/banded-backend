import { Schema, model, Document } from 'mongoose';

export interface Chat {
  _id?: string;
  chatId: string;
  user: string;
  messages: string;
}

interface ChatModel extends Omit<Chat, '_id'>, Document {}

const chatSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    chatId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message', required: true }],
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

export const Chat = model<ChatModel>('Chat', chatSchema);
