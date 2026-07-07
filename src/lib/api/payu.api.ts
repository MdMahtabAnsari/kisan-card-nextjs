import axios from "axios";

export const payuClient = axios.create({
    baseURL: "https://test.payu.in",
    headers: {'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    }
});