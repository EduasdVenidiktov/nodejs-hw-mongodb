import { Schema, model } from 'mongoose';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }, // автоматично додає поля createdAt та updatedAt, які будуть оновлюватись при створенні та оновленні документа відповідно.
);

//щоб пароль не був доступний на фронтенді. додавання методу toJSON до схеми usersSchema забезпечує автоматичне видалення поля password з об'єктів користувача під час серіалізації в JSON
usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Створення та експорт моделі на основі визначеної схеми
export const User = model('users', usersSchema);
