#!/usr/bin/env node

const http = require('http');
require('dotenv').config();

const myAPIKey = process.env.myAPIKey;
const region = process.argv[2];

const url = `http://api.openweathermap.org/data/2.5/weather?q=${region}&appid=${myAPIKey}&units=metric`;

http.get(url, (res) => {
    const {statusCode} = res;
    if (statusCode !== 200) {
        console.log(`statusCode: ${statusCode}`);
        return;
    }

    if (!region) {
        console.log("Пожалуйста, введите город");
    }

    res.setEncoding('utf-8');
    let rowData = '';
    res.on('data', (chunk) => rowData += chunk);
    res.on('end', () => {
        let parseData = JSON.parse(rowData);
        console.log(`Погода в регионе: ${region}`);
        console.log(`   Текущая температура: ${Math.round(parseData.main.temp)} С°`);
        console.log(`   Ощущается как: ${Math.round(parseData.main.feels_like)} С°`);
        console.log(`   Ветер: ${parseData.wind.speed} м/с, ${windDirection(parseData.wind.deg)}`);
        console.log(`   Давление: ${Math.round(parseData.main.pressure * 0.75006375541921)} мм/рт.с`);
        console.log(`   Влажность: ${parseData.main.humidity} %`);
    })
}).on('error', (err) => {
    console.error(err);
});

function windDirection (deg) {
    const n = 0, ne = 45, e = 90, se = 135, s = 180, sw = 225, w = 270, nw = 315, int = 22.5;
    if (deg > n - int && deg <= n + int) return 'северный';
    if (deg > ne - int && deg <= ne + int) {return 'северо-восточный'}
    if (deg > e - int && deg <= e + int) {return 'восточный'}
    if (deg > se - int && deg <= se + int) {return 'юго-восточный'}
    if (deg > s - int && deg <= s + int) {return 'южный'}
    if (deg > sw - int && deg <= sw + int) {return 'юго-западный'}
    if (deg > w - int && deg <= w + int) {return 'западный'}
    if (deg > nw - int && deg <= nw + int) {return 'северо-западный'}
};
