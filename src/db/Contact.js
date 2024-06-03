import { Schema, model } from 'mongoose';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
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
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt fields
    versionKey: false, //without '__V": 0;
  },
);

export const ContactsCollection = model('contacts', contactsSchema); //створюємо модель студента

//===================== ДЗ 4 ==============================================================
// import Joi from 'joi';

// export const createContactsSchema = Joi.object({
//   name: Joi.string().min(3).max(20).required().messages({
//     'string.base': 'Name should be a string',
//     'string.min': 'Name should have at least {#limit} characters',
//     'string.max': 'Name should have at most {#limit} characters',
//     'any.required': 'Name is required',
//   }),

//   phoneNumber: Joi.number().min(3).max(20).required().messages({
//     'string.base': 'Phone Number should be a string',
//     'string.min': 'Phone Number should have at least {#limit} characters',
//     'string.max': 'Phone Number should have at most {#limit} characters',
//     'any.required': 'Phone Number is required',
//   }),

//   email: Joi.string().min(3).max(20).email().optional().messages({
//     'string.base': 'Email should be a string',
//     'string.min': 'Email should have at least {#limit} characters',
//     'string.max': 'Email should have at most {#limit} characters',
//     'string.email': 'Email must be a valid email address',
//   }),

//   isFavourite: Joi.boolean().optional().messages({
//     'boolean.base': 'IsFavourite should be a boolean',
//   }),

//   contactType: Joi.string()
//     .valid('work', 'home', 'personal')
//     .default('personal')
//     .required()
//     .messages({
//       'string.base': 'Contact Type should be a string',
//       'any.only': 'Contact Type must be one of {#valids}',
//       'any.required': 'Contact Type is required',
//     }),
// });

// export const updateContactsSchema = Joi.object({
//   name: Joi.string().min(3).max(20).messages({
//     'string.base': 'Name should be a string',
//     'string.min': 'Name should have at least {#limit} characters',
//     'string.max': 'Name should have at most {#limit} characters',
//   }),

//   phoneNumber: Joi.number().min(3).max(20).messages({
//     'string.base': 'Phone Number should be a string',
//     'string.min': 'Phone Number should have at least {#limit} characters',
//     'string.max': 'Phone Number should have at most {#limit} characters',
//   }),

//   email: Joi.string().min(3).max(20).email().optional().messages({
//     'string.base': 'Email should be a string',
//     'string.min': 'Email should have at least {#limit} characters',
//     'string.max': 'Email should have at most {#limit} characters',
//     'string.email': 'Email must be a valid email address',
//   }),

//   isFavourite: Joi.boolean().optional().messages({
//     'boolean.base': 'IsFavourite should be a boolean',
//   }),

//   contactType: Joi.string()
//     .valid('work', 'home', 'personal')
//     .default('personal')
//     .required()
//     .messages({
//       'string.base': 'Contact Type should be a string',
//       'any.only': 'Contact Type must be one of {#valids}',
//       'any.required': 'Contact Type is required',
//     }),
// });
