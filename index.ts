import * as fs from 'fs'
import City from './City'
import World from './World'

const input = '01_AMS.txt'

const data = fs.readFileSync(input, 'utf8')
const lines = data.split('\n')

const strToRoute = (x: string[]): Route => [+x[0] - 1, +x[1] - 1]

const [origCityCount, origRouteCount] = strToRoute(lines[0].split(' '))

const routeLines = lines.slice(1, +origRouteCount + 2)

const routes: Route[] = []
routeLines.forEach(line => {
  routes.push(strToRoute(line.split(' ')))
})

const w = new World(origCityCount, 5, routes)
w.all()
