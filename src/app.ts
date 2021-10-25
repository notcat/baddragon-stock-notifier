import express from "express";
import {inv} from "./server";

// Create express server
const app = express();

// Express config
app.set("port", process.env.PORT || 3000);

app.get('/toys', function (req, res) {
    let toys = inv.getToys();
    
    res.send(toys);
    console.log("Sent toys object to client!")
})

export default app;