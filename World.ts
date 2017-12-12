import City from './City'
import Permutation from './Permutation'

export default class World {
  private cities: City[] = []

  constructor(private origCityCount: number, private minCityCount: number, private origRoutes: Route[]) {
    // Find optimum city number
    let cityCount = minCityCount
    while ((cityCount * (cityCount - 1)) % 4 !== 0) {
      cityCount++
    }

    // Create empty cities
    for (let i: number = 0; i < cityCount; i++) {
      this.cities[i] = new City(i)
    }

    // Populate afterRoutes
    this.cities.forEach(city => {
      city.init(this.cities)
    })

    // Add routes to cities
    origRoutes.forEach(route => this.addRoute(route))

    this.logCities(this.cities)
  }

  private addRoute(route: Route) {
    this.cities[route[0]].addRoute(this.cities[route[1]])
    this.cities[route[1]].addRoute(this.cities[route[0]])
  }

  private removeRoute(route: Route) {
    this.cities[route[0]].removeRoute(this.cities[route[1]])
    this.cities[route[1]].removeRoute(this.cities[route[0]])
  }

  public checkShallow(): boolean {
    const routeCounts = this.cities
      .map(city => city.routeCount())
      .sort()
      .toString()
    const afterRouteCounts = this.cities
      .map(city => city.afterRouteCount())
      .sort()
      .toString()

    return routeCounts === afterRouteCounts
  }

  public checkDeep(): boolean {
    const routeSigs = this.cities
      .map(city => city.signature() + ' ')
      .sort()
      .toString()
    const afterRouteSigs = this.cities
      .map(city => city.afterSignature() + ' ')
      .sort()
      .toString()

    console.log(routeSigs, afterRouteSigs)

    return routeSigs === afterRouteSigs
  }

  public all() {
    const optimalRouteCount = this.cities.length * (this.cities.length - 1) / 4
    console.log(this.origRoutes.length + ' -> ' + optimalRouteCount + ' routes')

    const newRoutesMap: ObjectMap<Route> = this.cities.reduce((result: ObjectMap<Route>, city) => {
      city
        .afterRouteList()
        .map(
          route =>
            (city.location < route.location
              ? [city.location, route.location]
              : [route.location, city.location]) as Route
        )
        .forEach(route => (result[route.toString()] = route))

      return result
    }, {})

    const allNewRoutes = Object.keys(newRoutesMap).map(key => newRoutesMap[key])

    console.log(allNewRoutes.length, 'new routes')

    const p = new Permutation(allNewRoutes, optimalRouteCount - this.origRoutes.length)

    let newRoutes: Route[] | null
    while ((newRoutes = p.next())) {
      newRoutes.forEach(route => this.addRoute(route))

      if (this.checkShallow() && this.checkDeep()) {
        this.logCities(this.cities)
        throw 0
      }

      newRoutes.forEach(route => this.removeRoute(route))
    }
  }

  private logCities = (cities: City[]) => {
    cities.forEach(city => city.log())
  }
}
