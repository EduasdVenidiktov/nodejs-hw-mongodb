import { Schema, model } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: { type: Schema.ObjectId, required: true, unique: true }, //використовується для зберігання ідентифікаторів інших документів, що дозволяє створювати зв'язки між різними колекціями в MongoDB.до кого відноситься сессія
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true }, //термін життя токену
    refreshTokenValidUntil: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

// Створення та експорт моделі на основі визначеної схеми
export const Session = model('sessions', sessionSchema);
