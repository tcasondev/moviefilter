require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const movies = require('./movies.json');
const helmet = require('helmet')
const { response } = require('express');

console.log(process.env.API_TOKEN)

const app = express()
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next){
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    console.log('Validating') 

    if(!authToken || authToken.split(' ')[1] !== apiToken){
        return res.status(401).json({ error: 'Please provide authentication.'})
    }

    next()
})

app.get('/movie',  (req, res) => {
    console.log('Searching...')
    let response = movies
    if(req.query.genre){
        response = response.filter(movies => movies.genre.toLowerCase().includes(req.query.genre.toLowerCase()))
    }

    if(req.query.country){
        response = response.filter(movies => movies.country.toLowerCase().includes(req.query.country.toLowerCase()))
    }

    if(req.query.avg_vote){
        response = response.filter(movies => Number(movies.avg_vote) >= req.query.avg_vote)
    }

    res.send(response)
})

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`)
})

console.log('hello')
