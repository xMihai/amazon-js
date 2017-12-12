"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class City {
    constructor(location) {
        this.location = location;
        this.routes = [];
        this.afterRoutes = [];
        this.routeList = () => this.routes.filter(route => route !== undefined);
        this.afterRouteList = () => this.afterRoutes.filter(route => route !== undefined);
        this.routeCount = () => this.routeList().length;
        this.afterRouteCount = () => this.afterRouteList().length;
        this.getRoutes = () => this.routes;
        this.getAfterRoutes = () => this.afterRoutes;
        this.signature = () => this.routeList()
            .map(route => route.routeCount())
            .sort()
            .toString();
        this.afterSignature = () => this.afterRouteList()
            .map(route => route.afterRouteCount())
            .sort()
            .toString();
    }
    init(cities) {
        this.afterRoutes = [...cities];
        delete this.afterRoutes[this.location];
    }
    addRoute(route) {
        this.routes[route.location] = route;
        delete this.afterRoutes[route.location];
    }
    removeRoute(route) {
        delete this.routes[route.location];
        this.afterRoutes[route.location] = route;
    }
    log() {
        console.log(this.location, this.routes.map(route => (route ? route.location : undefined)), this.afterRoutes.map(route => (route ? route.location : undefined)), this.signature(), this.afterSignature());
    }
}
exports.default = City;
