const { Contact } = require("../../models/contact");
// const contactSchema = require("../../models/contact");
const createError = require("../../helpers/createError");

const update = async (req, res) => {
  // const { error } = contactSchema.validate(req.body);
  // if (error) {
  //   throw createError(400, error.message);
  // }
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!result) {
    throw createError(404, "Not found");
  }
  res.json(result);
};

module.exports = update;
