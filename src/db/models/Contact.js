import { Schema, model } from 'mongoose';
// import Joi from 'joi';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    phoneNumber: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: false,
      minlength: 3,
      maxlength: 20,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },

    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    //авторизація
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    photoUrl: {
      type: String,
    }, //this way loading url
  },
  {
    timestamps: true, //  автоматично додає поля createdAt та updatedAt, які будуть оновлюватись при створенні та оновленні документа відповідно.
    versionKey: false, //without '__V": 0;
  },
);

// Створення та експорт моделі
export const ContactsCollection = model('contacts', contactsSchema); //створюємо модель студента
