import { Schema, model } from 'mongoose';

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
    //authorization
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    photo: {
      type: String,
    }, //this way loading url
  },
  {
    timestamps: true, //automatically adds the fields 'created' and 'updated', which will be updated when the document is created and updated, respectively.
    versionKey: false, //without '__V": 0;
  },
);

// Creating and exporting the model
export const ContactsCollection = model('contacts', contactsSchema); //creating contact`s model
