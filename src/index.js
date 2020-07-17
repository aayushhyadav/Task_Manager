const express = require('express')
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')
const mongoose = require('./db/mongoose')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server up at port ' + port)
})