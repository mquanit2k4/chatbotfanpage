import express from 'express';
import viewEngine from './config/viewEngine.js';
import initWebRoutes from './routes/web.js';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
dotenv.config();
let app = express();
// congif view engine
viewEngine(app);

// parse request to json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// init all web routes

initWebRoutes(app);

let port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App is running at the port ${port}`);
});

