"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const input = '01_AMS.txt';
const data = fs.readFileSync(input, 'utf8');
const lines = data.split('\n');
const [origCityCount, origRouteCount] = lines[0].split(' ');
console.log(origCityCount, origRouteCount);
const routeLines = lines.slice(1, +origRouteCount + 1);
const routes = [];
routeLines.forEach(line => {
    routes.push(strToRoute(line.split(' ')));
});
const strToRoute = (x) => [+x[0], +x[1]];
