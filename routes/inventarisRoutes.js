const express = require("express");
const router = express.Router();
const inventarisController = require("../controllers/inventarisController");
const upload = require("../middleware/upload");

router.post("/", upload.single("foto"), inventarisController.createInventaris);
router.get("/", inventarisController.getInventaris);
router.get("/:id", inventarisController.getInventarisById);
router.delete("/:id", inventarisController.deleteInventaris);
router.put("/:id", inventarisController.updateInventaris);

module.exports = router;
