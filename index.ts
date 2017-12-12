import * as fs from 'fs'
import City from './City'
import World from './World'

const input = '05_DUB.txt'
const output = input.replace('.txt', '_sol.txt')

const data = fs.readFileSync(input, 'utf8')
const lines = data.split('\n')

const strToRoute = (x: string[]): Route => [+x[0] - 1, +x[1] - 1]

const [origCityCount, origRouteCount] = lines[0].split(' ')

const routeLines = lines.slice(1, +origRouteCount + 1)

const routes: Route[] = []
routeLines.forEach(line => {
  routes.push(strToRoute(line.split(' ')))
})

const w = new World(+origCityCount, +origCityCount, routes)
const r = w.all()
console.log('---')
console.log(r)

fs.writeFileSync(output, r, 'utf8')
