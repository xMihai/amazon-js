export default class City {
  private routes: CityMap = []
  private afterRoutes: CityMap = []

  constructor(public readonly location: number) {}

  public init(cities: City[]) {
    this.afterRoutes = [...cities]
    delete this.afterRoutes[this.location]
  }

  public addRoute(route: City) {
    this.routes[route.location] = route
    delete this.afterRoutes[route.location]
  }

  public removeRoute(route: City) {
    delete this.routes[route.location]
    this.afterRoutes[route.location] = route
  }

  public routeList = (): City[] => this.routes.filter(route => route !== undefined) as City[]
  public afterRouteList = (): City[] => this.afterRoutes.filter(route => route !== undefined) as City[]

  public routeCount = () => this.routeList().length
  public afterRouteCount = () => this.afterRouteList().length

  public getRoutes = () => this.routes
  public getAfterRoutes = () => this.afterRoutes

  public signature = () =>
    this.routeList()
      .map(route => route.routeCount())
      .sort()
      .toString()

  public afterSignature = () =>
    this.afterRouteList()
      .map(route => route.afterRouteCount())
      .sort()
      .toString()

  public log() {
    console.log(
      this.location,
      this.routes.map(route => (route ? route.location : undefined)),
      this.afterRoutes.map(route => (route ? route.location : undefined)),
      this.signature(),
      this.afterSignature()
    )
  }
}

export type CityMap = Array<City | undefined>
