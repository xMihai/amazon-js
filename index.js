"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const World_1 = require("./World");
const input = '01_AMS.txt';
const data = fs.readFileSync(input, 'utf8');
const lines = data.split('\n');
const strToRoute = (x) => [+x[0] - 1, +x[1] - 1];
const [origCityCount, origRouteCount] = strToRoute(lines[0].split(' '));
const routeLines = lines.slice(1, +origRouteCount + 2);
const routes = [];
routeLines.forEach(line => {
    routes.push(strToRoute(line.split(' ')));
});
const w = new World_1.default(origCityCount, 5, routes);
w.all();
