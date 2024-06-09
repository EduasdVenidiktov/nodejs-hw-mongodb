import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }, // автоматично додає поля createdAt та updatedAt, які будуть оновлюватись при створенні та оновленні документа відповідно.
);

//додавання методу toJSON до схеми usersSchema забезпечує автоматичне видалення поля password з об'єктів користувача під час серіалізації в JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Створення та експорт моделі на основі визначеної схеми
const UsersCollection = model('model', userSchema);
export default UsersCollection;
