import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://10.26.40.13:4444'
    baseURL: 'http://192.168.15.9:4444',

});

export default api;