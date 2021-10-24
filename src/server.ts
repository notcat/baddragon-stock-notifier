import app from './app';
import inventory from "./inventory";

const server = app.listen(app.get("port"), () => {
    console.log("App running on port %d", app.get("port"))
})

const inv = new inventory(10000); // Delay to fetch api, in miliseconds

inv.listen(); // Listens for the inventory changes

export default server;