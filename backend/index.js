const express = require('express')
const cors = require('cors')
const compression = require('compression')
const morgan = require('morgan')
const dotenv = require('dotenv')
const errorHandler = require('./middlewares/errorHandler')
const connectDB = require('./configs/db.config')

dotenv.config()
const app = express()

connectDB()

app.use(cors())
app.use(express.json())

// dùng để log ra các request đến server
app.use(morgan('dev'))
// dùng để nén dữ liệu trước khi gửi về client
app.use(compression())

app.use('/api', require('./routers/index'))
app.use('', require('./routers/error.router'))
// Middleware xử lý lỗi
app.use(errorHandler)
const PORT = process.env.PORT || 5001

app.listen(PORT, () =>
    console.error(`Server running in http://localhost:${PORT}`)
)
