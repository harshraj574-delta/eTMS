import axios from 'axios';

const baseUrl = "/api/api/v1";
const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

const api = axios.create({
    baseURL: baseUrl,
    headers

})

export { api }