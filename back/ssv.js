const Joi = require("joi");

const schemaPatient = Joi.object({
  name: Joi.string().min(3).max(50).trim().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  DOB: Joi.date().less('now').optional().allow(null, ''),
  gender: Joi.string().valid("Male", "Female", "Other").optional(),
  bloodGroup: Joi.string()
    .valid("O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-")
    .optional(),
});

const schemaRecords = Joi.object({
  date: Joi.date().required(),
  doctor: Joi.string().min(3).max(50).trim().required()
});

const schemaMedication = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  start: Joi.date().required(),
});

const schemaContact = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required().trim(),
  phone: Joi.string().required()
});

module.exports = {
  schemaMedication,
  schemaContact,
  schemaPatient,
  schemaRecords,
};
