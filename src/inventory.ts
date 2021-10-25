import axios from "axios";
import { Response } from "express";

let page: number = 1;

const totalInventory: string = "https://web.archive.org/web/20210312230702/https://bad-dragon.com/api/inventory-toys/total?price[min]=0&price[max]=300&";

class startInventory {
    refreshTime: number;
    inventory: Inventory = {
        limit: 0,
        page: 200,
        toys: [],
    };

    constructor(refreshTime: number) {
        this.refreshTime = refreshTime

        fetchInventory().then((inventory) => {
            if(inventory === undefined) { console.log("Error setting class inventory to the fetched inventory!"); return;}
            this.inventory = inventory;
        });
    }

    listen() {
        setInterval(fetchInventory, this.refreshTime);

        //console.log(this.inventory.toys[1].sku);
    }

    getToys() { // index:number | undefined
        //if(index === undefined){
            console.log(this.inventory);
            return this.inventory.toys;
            
        //} else{
        //     return this.inventory.toys[index];
        // }
    }

    
}

async function fetchInventory() {
    return getTotalInventory().then((data) => {
        if (data?.total === undefined) { console.log("Total number of inventory items is NOT a number!"); return; }

        return Math.floor(data?.total / 60); // should probably enforce number only return but this can only be a number so /shrug
    }).then((pagesRequired) => {
        // We now have the amount of pages we need to fetch
        if (pagesRequired === undefined) { console.log("Error getting the pages required"); return; }

        let returnedInventory:Inventory  = {
            limit: 0,
            page: 1,
            toys: [],
        };

        (async () => {
            //  Make initial array
            let inventory: Inventory = {
                limit: 0,
                page: 500,
                toys: [],
            };

            for (let i: number = 1; i < 1 + 1; i++) {
                console.log(i);

                if (i === 1) { // If the first inventory search
                    getInventory(i).then((data) => {
                        if (data === undefined) { console.log("Error getting inventory from page"); return; }
                        // Set the inventory to this so we can get the initial inventory, from then we just add on to the toys.
                        inventory = data;
                        console.log(inventory);

                        // inventory.toys.forEach(toy => {
                        //     console.log(toy.sku);
                        // });
                    });
                } else {
                    console.log("here! index " + i);
                    getInventory(i).then((data) => {
                        if (data === undefined) { console.log("Error getting inventory from page"); return; }
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
                
                await delay(2500); // Wait 1500 miliseconds to prevent flooding the API
            }

            return inventory;
        })().then(inventory => {
            returnedInventory = inventory;
        });

        return returnedInventory;
    }).then((inventory) => {
        // We have got all the toys! Return the array full of toys!
        return inventory;
    });
}

async function getTotalInventory() {
    try {
        const response = await axios.get(totalInventory);

        if (response.status === 200) {
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

        if (response.status === 200) {
            // Success!
            // console.log("Successfully queried inventory");
            // console.log((response.data as Inventory).toys[1]);
            return response.data as Inventory;
        }
    } catch (error) {
        console.log("Error contacting website! : " + error)
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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