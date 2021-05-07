import mongoose, { Mongoose } from 'mongoose';

export const connect = async (): Promise<Mongoose> =>
  mongoose.connect('mongodb://localhost:27017/banded', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

export const close = (): Promise<void> => mongoose.connection.close();
