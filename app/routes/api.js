import express from "express";
const router = express.Router();

//export  router.use("/marketInsights", require("./marketInsights"));

export default router.use("/homeValue", require("./homevalue"));

//export  router.use("/remodelValue", require("./remodelValue"));

// module.exports = router
