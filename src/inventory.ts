import axios from "axios";

const inventoryUrl: string = "https://bad-dragon.com/api/inventory-toys?price[min]=0&price[max]=300&sort[field]=price&&sort[direction]=asc&page=1&limit=60"

class startInventory {
    refreshTime: number;

    constructor(refreshTime:number) {
        this.refreshTime = refreshTime

        fetchInventory();
    }

    listen() {
        setInterval(fetchInventory, this.refreshTime);
    }
}

function fetchInventory(){
    axios.get(inventoryUrl)
        .then(function (response) {
            // handle success
            console.log(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}

export default startInventory;