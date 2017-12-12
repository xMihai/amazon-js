import * as fs from 'fs'

const input = '01_AMS.txt'

const data = fs.readFileSync(input, 'utf8')
const lines = data.split('\n')
const [origCityCount, origRouteCount]  = lines[0].split(' ')

console.log(origCityCount, origRouteCount)

const routeLines = lines.slice(1, +origRouteCount + 1)
const routes: Route[] = []
routeLines.forEach(line => {
  routes.push(strToRoute(line.split(' ')))
})

const strToRoute = (x: string[]): Route => [+x[0], +x[1]]

type Route = [number, number]
