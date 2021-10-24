import axios from "axios";
import { Response } from "express";

let page: number = 1;

const totalInventory: string = "https://web.archive.org/web/20210312230702/https://bad-dragon.com/api/inventory-toys/total?price[min]=0&price[max]=300&";

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
        // We now have the amount of pages we need to fetch
        if(pagesRequired === undefined){ console.log("Error getting the pages required"); return; }

        let inventory:Inventory = {
            limit: 60,
            page: 1,
            toys: [],
        };

        for (let i:number = 1; i < pagesRequired+1; i++) {
            if(i === 1) { // If the first inventory search
                getInventory(i).then((data) => {
                    if(data === undefined) { console.log("Error getting inventory from page"); return; }
                    // Set the inventory to this so we can get the initial inventory, from then we just add on to the toys.
                    inventory = data;
                });
            }else{
                getInventory(i).then((data) => {
                    if(data === undefined){ console.log("Error getting inventory from page"); return; }
                    data.toys.forEach(toy => {
                        // Only put the new toy in if it exists! 
                        // We could have inconsistancies when going to next page if the inventory changes during our requests. 
                        // I dont believe this is possible to overcome, so we must check if it exists before pushing.
                        // If a toy gets added/removed, its not too big of a deal, because we just check it again X number of seconds later
                        // defined in server.ts
    
                        inventory.toys.indexOf(toy) === -1 ? inventory.toys.push(toy) : console.log("This item already exists");   
                    });
                });
            }

            console.log(pagesRequired);
            delay(500); // Wait 500 miliseconds to prevent flooding the API
        }

        return inventory;
    }).then((inventory) => {
        // We have got all the toys! Return the array full of toys!
        console.log(inventory);
        return inventory;
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
        console.log("Error contacting website!")
    }
}

async function getInventory(page: number) {
    // should probably figure out a better way of doing this :/
    let inventoryUrl: string = `https://web.archive.org/web/20210312230702/https://bad-dragon.com/api/inventory-toys?price[min]=0&price[max]=300&sort[field]=price&&sort[direction]=asc&page=${page}&limit=60`
    console.log(inventoryUrl);
    console.log(page);
    try {
        const response = await axios.get(inventoryUrl);

        if(response.status === 200){
            // Success!
            console.log("cum");
            return response.data as Inventory;
        }
    } catch (error) {
        console.log("Error contacting website! : " + error)
    }
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

interface TotalInventory {
    total: number;
}

interface Inventory {
    limit: number;
    page: number;
    toys: Toy[];
}

interface Toy {
    id: number,
    id_list: string,
    sku: string,
    price: string, // this maybe could be impicitily turned into number?
    size: number,
    firmness: number,
    cumtube: number,
    suction_cup: number,
    color_theme: number,
    created: string,
    weight: string,
    is_flop: boolean,
    external_flop_reason: string | null,
    color_display: string,
    colorTheme: ColorTheme,
    images: Images,
}

interface ColorTheme {
    id: number,
    name: string,
    description: string,
    bodyOptionId: number,
    baseOptionId: number,
    priceModifier: string,
    singleProduct: boolean,
    specification: string,
    isSurpriseMe: boolean,
    globalPreviewOverrideImage: boolean | null,
    swatchImageId: number,
    sort_order: number,
    startDate: string | null,
    endDate: string | null,
}

interface Images {
    id: number,
    inventoryToyId: number,
    created: string,
    sortOrder: number,
    imageUrlFull: string,
    imageUrl450: string,
    ImageUrl240: string,
    ImageUrl150: string,
    ImageUrl1200: string,
}

export default startInventory;