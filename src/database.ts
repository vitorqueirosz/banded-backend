import mongoose, { Mongoose } from 'mongoose';

export const connect = async (): Promise<Mongoose> =>
  mongoose.connect(String(process.env.MONGO_URL), {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

export const close = (): Promise<void> => mongoose.connection.close();
