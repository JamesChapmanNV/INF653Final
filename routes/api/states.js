const express = require("express");
const router = express();
const stateController = require("../../controllers/stateController");

router
  .route("/")
  .get(stateController.getStates)
  .post(stateController.createNewState)
  .put(stateController.updateState)
  .delete(stateController.deleteState);

router.route("/:code").get(stateController.getState);

router.route("/:code/funfact")
      .get(stateController.getFunFact)
      .post(stateController.postFunFact)
      .patch(stateController.patchFunFact)
      .delete(stateController.deleteFunFact);
router.route("/:code/capital").get(stateController.getCapital);
router.route("/:code/nickname").get(stateController.getNickname);
router.route("/:code/population").get(stateController.getPopulation);
router.route("/:code/admission").get(stateController.getAdmission);

module.exports = router;
