import axios from "axios";
import { OrderPlayload } from "./Orders/types";

const API_URL = import.meta.env.VITE_API_URL ?? import.meta.env.REACT_APP_API_URL ?? (typeof process !== 'undefined' && process.env ? process.env.REACT_APP_API_URL : undefined) ?? 'http://localhost:8080';
const mapboxToken = import.meta.env.VITE_ACCESS_TOKEN_MAP_BOX ?? import.meta.env.REACT_APP_ACCESS_TOKEN_MAP_BOX ?? (typeof process !== 'undefined' && process.env ? process.env.REACT_APP_ACCESS_TOKEN_MAP_BOX : undefined);

export function fetchproducts(){
    return axios(`${API_URL}/products`)
}

export function fetchLocalMapBox(local: string){
    return axios(`https://api.mapbox.com/geocoding/v5/mapbox.places/${local}.json?access_token=${mapboxToken}`)
}

export function saveOrder(payload: OrderPlayload){
    return axios.post(`${API_URL}/orders`, payload)
}