import mongoose from "mongoose";

export const connectdb = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in the environment");
  }

  await mongoose
    .connect(mongoUri)
    .then(() => console.log(`DB connected: ${mongoose.connection.name}`));
};
