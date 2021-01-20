import { model, Schema, Document } from 'mongoose';

export interface BandMembers {
  _id: string;
  function: string;
  name: string;
  band: string;
}

interface BandMembersModel extends Omit<BandMembers, '_id'>, Document {}

const bandMembersSchema = new Schema(
  {
    name: { type: String, required: true },
    function: { type: String, required: true },
    band: { type: Schema.Types.ObjectId, ref: 'Band', required: true },
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

export const BandMembers = model<BandMembersModel>(
  'BandMembers',
  bandMembersSchema,
);
