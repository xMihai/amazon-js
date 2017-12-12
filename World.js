"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const City_1 = require("./City");
const Permutation_1 = require("./Permutation");
class World {
    constructor(origCityCount, minCityCount, origRoutes) {
        this.origCityCount = origCityCount;
        this.minCityCount = minCityCount;
        this.origRoutes = origRoutes;
        this.cities = [];
        this.logCities = (cities) => {
            cities.forEach(city => city.log());
        };
        // Find optimum city number
        let cityCount = minCityCount;
        while ((cityCount * (cityCount - 1)) % 4 !== 0) {
            cityCount++;
        }
        // Create empty cities
        for (let i = 0; i < cityCount; i++) {
            this.cities[i] = new City_1.default(i);
        }
        // Populate afterRoutes
        this.cities.forEach(city => {
            city.init(this.cities);
        });
        // Add routes to cities
        origRoutes.forEach(route => this.addRoute(route));
        this.logCities(this.cities);
    }
    addRoute(route) {
        this.cities[route[0]].addRoute(this.cities[route[1]]);
        this.cities[route[1]].addRoute(this.cities[route[0]]);
    }
    removeRoute(route) {
        this.cities[route[0]].removeRoute(this.cities[route[1]]);
        this.cities[route[1]].removeRoute(this.cities[route[0]]);
    }
    checkShallow() {
        const routeCounts = this.cities
            .map(city => city.routeCount())
            .sort()
            .toString();
        const afterRouteCounts = this.cities
            .map(city => city.afterRouteCount())
            .sort()
            .toString();
        return routeCounts === afterRouteCounts;
    }
    checkDeep() {
        const routeSigs = this.cities
            .map(city => city.signature() + ' ')
            .sort()
            .toString();
        const afterRouteSigs = this.cities
            .map(city => city.afterSignature() + ' ')
            .sort()
            .toString();
        console.log(routeSigs, afterRouteSigs);
        return routeSigs === afterRouteSigs;
    }
    all() {
        const optimalRouteCount = this.cities.length * (this.cities.length - 1) / 4;
        console.log(this.origRoutes.length + ' -> ' + optimalRouteCount + ' routes');
        const newRoutesMap = this.cities.reduce((result, city) => {
            city
                .afterRouteList()
                .map(route => (city.location < route.location
                ? [city.location, route.location]
                : [route.location, city.location]))
                .forEach(route => (result[route.toString()] = route));
            return result;
        }, {});
        const allNewRoutes = Object.keys(newRoutesMap).map(key => newRoutesMap[key]);
        console.log(allNewRoutes.length, 'new routes');
        const p = new Permutation_1.default(allNewRoutes, optimalRouteCount - this.origRoutes.length);
        let newRoutes;
        while ((newRoutes = p.next())) {
            newRoutes.forEach(route => this.addRoute(route));
            if (this.checkShallow() && this.checkDeep()) {
                this.logCities(this.cities);
                throw 0;
            }
            newRoutes.forEach(route => this.removeRoute(route));
        }
    }
}
exports.default = World;
