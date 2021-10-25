import express from "express";
import {inv} from "./server";

// Create express server
const app = express();

// Express config
app.set("port", process.env.PORT || 3000);

app.get('/toys', function (req, res) {
    let toys = inv.getToys();
    
    console.log(toys);
    res.send(toys[0]);
})

export default app;