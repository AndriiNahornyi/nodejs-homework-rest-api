const { Contact } = require("../../models/contact");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page, limit, favorite } = req.query;

  const queryOptions = { skip: 0, limit: 20 };
  +limit < 1 ? (queryOptions.limit = 1) : (queryOptions.limit = +limit);
  page < 1
    ? (queryOptions.skip = 0)
    : (queryOptions.skip = (+page - 1) * queryOptions.limit);

  const filter = { owner };

  if (favorite !== undefined) filter.favorite = favorite;
  const result = await Contact.find(
    filter,
    "name email phone favorite",
    queryOptions
  ).populate("owner", "name email");
  res.json(result);
};

module.exports = getAll;
