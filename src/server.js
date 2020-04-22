const api_call = require('./api-call')
const app = require('./app')

const { PORT } = require('./config')

app.listen(PORT, () => {
    // api_call()
    console.log(`Server listening at http://localhost:${PORT}`)
})