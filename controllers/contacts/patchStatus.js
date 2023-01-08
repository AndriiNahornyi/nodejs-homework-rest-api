const { Contact } = require("../../models/contact");
const createError = require("../../helpers/createError");

const patchStatus = async (req, res) => {
  const { contactId } = req.params;
  // const { error } = updateFavorite.validate(req.body);
  // if (error) {
  //   throw createError(400, error.message);
  // }
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!result) {
    throw createError(404, "Not found");
  }
  res.json(result);
};

module.exports = patchStatus;
