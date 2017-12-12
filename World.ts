import City, { CityMap } from './City'
import Permutation from './Permutation'

export default class World {
  private cities: City[] = []

  constructor(private origCityCount: number, private minCityCount: number, private origRoutes: Route[]) {
    // There may be a min city count because of a high number of routes
    const minCityCountByRoutes = Math.ceil((Math.sqrt(16 * origRoutes.length + 1) + 1) / 2)

    // Find optimum city number
    let cityCount = Math.max(minCityCount, minCityCountByRoutes)
    while ((cityCount * (cityCount - 1)) % 4 !== 0) {
      cityCount++
    }

    console.log(`${origCityCount} -> ${cityCount} cities`)

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

  public all(): string {
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
        const newMap = this.remap()

        if (newMap) {
          return (
            `${this.cities.length - this.origCityCount} ${optimalRouteCount - this.origRoutes.length}\n` +
            newRoutes.map(route => `${route[0] + 1} ${route[1] + 1}`).join('\n') +
            (newRoutes.length > 0 ? '\n' : '') +
            newMap.map(x => x + 1).join('\n') +
            '\n'
          )
        }
      }

      newRoutes.forEach(route => this.removeRoute(route))
    }

    const w = new World(this.origCityCount, this.cities.length + 1, this.origRoutes)

    return w.all()
  }

  private remap(): number[] | null {
    this.logCities()

    let newMap: CityMap = []
    let moved: boolean[] = []

    // use each city as starting point
    if (
      this.cities.some(city => {
        newMap = []
        moved = this.cities.map(() => false)

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

        return valid
      })
    ) {
      return newMap.map(city => (city as City).location)
    }

    return null
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
