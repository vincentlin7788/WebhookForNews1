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
	const dia_action = req.body.result.action;
	
	
	if (dia_action = "news.search") {
		
    const category = req.body.result.parameters.category;
	console.log(category);
    //const geoCountry = req.body.result.contexts[0].parameters.geo-country.original
    const geoCountry = req.body.result.parameters["geo-country"];
	console.log(geoCountry);
	const countrymap = {"United States of America":"us","Germany":"de","China":"cn","United Kingdom of Great Britain and Northern Ireland":"GB"};
	const geoCountryCode = countrymap[geoCountry];
	
	console.log(geoCountryCode);
    //const country = dlv(countryDataByName, `${geoCountry}.alpha2`, 'us')


    //const movieToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.Movies ? req.body.result.parameters.Movies : 'The Godfather';
    const reqUrl = encodeURI(`http://newsapi.org/v2/top-headlines?country=${geoCountryCode}&category=${category}&apikey=${API_KEY}`);
    http.get(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const newsResp = JSON.parse(completeResponse);
            let dataToSend = geoCountry === 'MS' ? `I don't have the required info on that. Here's some info on 'The Godfather' instead.\n` : '';
            console.log("success have article");
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
	//--------------------
	} else if (dia_action = "action.movie") {
	
	
	
	const movieToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.Movies ? req.body.result.parameters.Movies : 'The Godfather';
    const reqUrl = encodeURI(`http://www.omdbapi.com/?t=${movieToSearch}&apikey=67358f7e`);
    http.get(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const movie = JSON.parse(completeResponse);
            let dataToSend = movieToSearch === 'The Godfather' ? `I don't have the required info on that. Here's some info on 'The Godfather' instead.\n` : '';
            dataToSend += `${movie.Title} is a ${movie.Actors} starer ${movie.Genre} movie, released in ${movie.Year}. It was directed by ${movie.Director}`;

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
	//----------------
		
	};
});

server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running..8000.");
});