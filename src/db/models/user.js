import { Schema, model } from 'mongoose';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }, // Automatically adds fields 'createdAt' and 'updatedAt', which will be updated upon document creation and update, respectively.
);

//o prevent the password from being exposed on the frontend, adding a 'toJSON' method to the 'usersSchema' ensures automatic removal of the password field from user objects during serialization to JSON.
usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Create and export model based defined schema
export const User = model('users', usersSchema);
