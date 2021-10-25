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
