import City, { CityMap } from './City'
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

      this.checkShallow() && this.checkDeep() && this.remap()

      newRoutes.forEach(route => this.removeRoute(route))
    }
  }

  private remap() {
    this.logCities()

    // use each city as starting point
    this.cities.forEach(city => {
      const newMap: CityMap = []
      const moved: boolean[] = this.cities.map(() => false)

      let startCity = moved.indexOf(false)
      let valid = true
      while (startCity > -1 && valid) {
        valid = this.relocate(
          this.cities[startCity],
          newMap,
          moved,
          moved.reduce((result: number[], val, i) => {
            if (!val) result.push(i)
            return result
          }, [])
        )
        startCity = moved.indexOf(false)
      }

      if (valid) throw 1
    })
  }

  private relocate(city: City, newMap: CityMap, moved: boolean[], availableLocations: number[]): boolean {
    console.log('try to relocate city ' + city.location)

    return availableLocations
      .filter(location => this.cities[location].signature() === city.afterSignature())
      .some(location => {
        newMap[location] = city
        moved[city.location] = true

        if (this.fit(city, location, newMap, moved, availableLocations)) {
          console.log(city.location + ' fits in location ' + location)
          return true
        }

        console.log(city.location + ' does NOT fit in location ' + location)

        delete newMap[location]
        moved[city.location] = false
        return false
      })
  }

  private fit(city: City, location: number, newMap: CityMap, moved: boolean[], availableLocations: number[]): boolean {
    console.log('check fit of city ' + city.location + ' in location ' + location)

    // Destinations of old location
    const oldRoutes = this.cities[location].routeList().map(d => d.location)

    // Destinations of new city
    const newRoutes = city.afterRouteList()

    return newRoutes.every(newDest => {
      // Check if destination city was moved
      if (moved[newDest.location]) {
        // Was the destination city moved in a location that was an old route?
        if (!oldRoutes.includes(newMap.indexOf(newDest))) {
          // This city is not fit for this location
          return false
        }
        return true
      } else {
        // Try to move new destination to an old acceptable location
        return this.relocate(newDest, newMap, moved, oldRoutes.filter(oldRoute => newMap[oldRoute] === undefined))
      }
    })
  }

  private logCities = () => {
    this.cities.forEach(city => city.log())
  }
}
