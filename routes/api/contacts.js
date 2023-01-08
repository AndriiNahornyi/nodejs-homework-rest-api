const express = require("express");
const ctrlr = require("../../controllers/contacts");
const { authorize, vaidateBody } = require("../../middlewares");
const { schemas } = require("../../models/contact");
const { ctrlrWrapper } = require("../../helpers");
const router = express.Router();

router.get("/", authorize, ctrlrWrapper(ctrlr.getAll));

router.get("/:contactId", authorize, ctrlrWrapper(ctrlr.getById));

router.post("/", authorize, vaidateBody(schemas.add), ctrlrWrapper(ctrlr.add));

router.delete("/:contactId", authorize, ctrlrWrapper(ctrlr.deleteById));

router.put(
  "/:contactId",
  authorize,
  vaidateBody(schemas.update),
  // validateBody(schemas.add),
  ctrlrWrapper(ctrlr.update)
);

router.patch(
  "/:contactId/favorite",
  authorize,
  vaidateBody(schemas.patchStatus),
  ctrlrWrapper(ctrlr.patchStatus)
);

module.exports = router;
