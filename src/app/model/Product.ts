export interface AMAZON {
    price?: any;
    url: string;
}

export interface BESTBUY {
    price: number;
    url: string;
}

export interface WALMART {
    price: number;
    url: string;
}

export interface PriceList {
    AMAZON: AMAZON;
    BESTBUY: BESTBUY;
    WALMART: WALMART;
}

export interface Product {
    name: string;
    imgURL: string;
    modelID: string;
    priceList: PriceList;
    validModel: boolean;
}
