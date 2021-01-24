import mongoose, { Mongoose } from 'mongoose';

export const connect = async (): Promise<Mongoose> =>
  mongoose.connect(
    'mongodb+srv://vitor:sala82821762@cluster0.0tokq.mongodb.net/banded?retryWrites=true&w=majority',
    // 'mongodb://localhost:27017/banded',
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  );

export const close = (): Promise<void> => mongoose.connection.close();
