import express from "express";
import chatbotController from "../controllers/chatbotController.js";
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', chatbotController.getHomepage);
    router.post('/setup-profile', chatbotController.setupProfile);


    router.get("/webhook", chatbotController.getWebhook);
    router.post("/webhook", chatbotController.postWebhook);

    return app.use("/", router);
}; 

export default initWebRoutes;