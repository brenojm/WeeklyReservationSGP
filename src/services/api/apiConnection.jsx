import axios from "axios";
import stringConnection from "../../config/stringConnection";

export const api = axios.create({
    baseURL:`${stringConnection.baseURL}`
});