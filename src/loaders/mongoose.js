import mongoose from 'mongoose';

const { connection, Schema, model } = mongoose;

const userSchema = new Schema({
  displayName: {type: String, required: true},
  from: Number
});
export const userModel = model('User', userSchema);

export default async () => {
  connection.once('connected', () => console.log('MongoDB connected'));
  connection.on('error', (err) =>
    console.error('MongoDB connection error:', err),
  );
  process
    .on('SIGINT', () => connection.close())
    .on('SIGTERM', () => connection.close());

  await mongoose.connect(process.env.DATABASE_URI);
};
