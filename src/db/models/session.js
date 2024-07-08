import { Schema, model } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: { type: Schema.ObjectId, required: true, unique: true }, //It is used to store identifiers of other documents, allowing relationships to be created between different collections in MongoDB.
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true }, //token lifetime
    refreshTokenValidUntil: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

// Creating and exporting a model based on a defined schema
export const Session = model('sessions', sessionSchema);
