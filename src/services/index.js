import axios from 'axios';

export function requestAPI () {
    const response = axios.create({
        baseURL: 'https://5f637566363f0000162d8b16.mockapi.io/milhas321/api/v1/'
    });
    
    return response;
} 

export function requestAPIFilmes () {
   const URL =  axios.create({
        baseURL: 'https://api.tvmaze.com/search/shows?q='
    });

    return URL;
} 


