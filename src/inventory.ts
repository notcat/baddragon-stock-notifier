import axios from "axios";
import { Response } from "express";

let page: number = 1;

const totalInventory: string = "https://bad-dragon.com/api/inventory-toys/total?price[min]=0&price[max]=300&";
const inventoryUrl: string = `https://bad-dragon.com/api/inventory-toys?price[min]=0&price[max]=300&sort[field]=price&&sort[direction]=asc&page=${page}&limit=60`

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
    getTotalInventory().then((data) => {
        if(data?.total === undefined){ console.log("Total number of inventory items is NOT a number!"); return; }

        return Math.floor(data?.total/60); // should probably enforce number only return but this can only be a number so /shrug
    }).then((pagesRequired) => {
        console.log(pagesRequired);
    });
}

async function getTotalInventory() {
    try {
        const response = await axios.get(totalInventory);

        if(response.status === 200){
            // Success!
            return response.data as TotalInventory;
        }
    } catch (error) {
        
    }
    
}

interface TotalInventory {
    total: number;
}

export default startInventory;