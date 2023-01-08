const { Contact } = require("../../models/contact");
// const contactSchema = require("../../models/contact");
// const createError = require("../../helpers/createError");

const add = async (req, res) => {
  const { _id: owner } = req.user;
  // const { error } = contactSchema.validate(req.body);
  // if (error) {
  //   throw createError(400, error.message);
  // }
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

module.exports = add;
