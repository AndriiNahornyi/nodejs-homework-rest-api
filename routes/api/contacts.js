const express = require("express");
const Joi = require("joi");
const Contact = require("../../models/contact");

const { createError } = require("../../helpers");
const { authorize } = require("../../middlewares");

const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string()
    .pattern(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    )
    .message("Phone number must be min 6 numbers length")
    .required(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

router.get("/", authorize, async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", authorize, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw createError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", authorize, async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { error } = contactSchema.validate(req.body);
    if (error) {
      throw createError(400, error.message);
    }
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", authorize, async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
      throw createError(404, "Not found");
    }
    res.json({
      message: "Contact deleted",
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
});

router.put("/:contactId", authorize, async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      throw createError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw createError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", authorize, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) {
      throw createError(400, error.message);
    }
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw createError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
