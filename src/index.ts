import express, { Application } from 'express'
import { routes } from './routes'
import { logger } from './utils/logger'
import bodyParser from 'body-parser'
import cors from 'cors'

// connect to database
import './utils/connectDB'

import deserializedToken from './middleware/deserializedToken'

const app: Application = express()
const port: number = 4000

// body parse

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// cors access handler
app.use(cors())
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

// deserialized token middleware
app.use(deserializedToken)

routes(app)
app.listen(port, () => logger.info(`Server is listening on port ${port}`))
