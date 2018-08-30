'use strict';

const express = require('express');
const bodyParser = require('body-parser');
//const https = require('https');
const http = require('http');
const API_KEY = require('./apiKey');

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.post('/get-movie-details', (req, res) => {
    const category = req.body.result.parameters.category
	console.log(category)
    //const geoCountry = req.body.result.contexts[0].parameters.geo-country.original
    const geoCountry = req.body.result.parameters.geoCountry
	console.log(geoCountry)
    //const country = dlv(countryDataByName, `${geoCountry}.alpha2`, 'us')


    //const movieToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.Movies ? req.body.result.parameters.Movies : 'The Godfather';
    const reqUrl = encodeURI(`http://newsapi.org/v2/top-headlines?country=${geoCountry}&category=${category}&apikey=${API_KEY}`);
    http.get(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const newsResp = JSON.parse(completeResponse);
            let dataToSend = geoCountry === 'MS' ? `I don't have the required info on that. Here's some info on 'The Godfather' instead.\n` : '';
            console.log(newsResp);
			dataToSend = `${newsResp.articles[1].title}\n ${newsResp.articles[1].description}\n URLs Address is:\n ${newsResp.articles[1].url}`;
			console.log()
            return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'get-movie-details'
            });
        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-movie-details'
        });
    });
});

server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running..8000.");
});