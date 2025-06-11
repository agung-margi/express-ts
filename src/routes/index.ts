import { Application, Router } from 'express'
import { HealthRouter } from './health.router'
import { ProductRouter } from './product.router'
import { UserRouter } from './user.router'

const _routes: Array<[string, Router]> = [
  ['/health', HealthRouter],
  ['/products', ProductRouter],
  ['/users', UserRouter]
]

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route
    app.use(url, router)
  })
}
