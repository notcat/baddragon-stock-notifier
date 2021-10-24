import express from "express";
import {inv} from "./server";

// Create express server
const app = express();

// Express config
app.set("port", process.env.PORT || 3000);

app.get('/', function (req, res) {
    res.send(inv.getToys);
})

export default app;