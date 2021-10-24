import express from "express";
import {inv} from "./server";

// Create express server
const app = express();

// Express config
app.set("port", process.env.PORT || 3000);

app.get('/', function (req, res) {
    let toys = inv.getToys(undefined);

    let json = { ...toys };

    json = Object.assign({}, toys);

    json = toys.reduce((json: any, value: any, key: any) => { json[key] = value; return json; }, {});
    
    res.send(json);
})

export default app;