import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    birthdate: { type: Date },
    phoneNumber: { type: String },
    savedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
    },
  },
  { timestamps: true }
); // Added timestamps for better tracking

const User = mongoose.model("User", UserSchema);

export default User;
