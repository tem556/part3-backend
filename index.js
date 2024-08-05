const express = require('express')
const app = express()


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}


app.use(express.json())
app.use(requestLogger)

const cors = require('cors')
app.use(cors())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) => {
    console.log(request)
    response.json(persons)
})


app.get('/info', (request, response) => {
    let responseStr = "<p> Phonebook has info for " + persons.length + " people <p>"
    let currDate = new Date()
    responseStr += currDate
    response.send(responseStr)
})


app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find((person) => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body ) {
        return response.status(404).json({
            "error": "missing content"
        })
    }

    if (!body.name || !body.number) {
        return response.status(400).json({
            "error": "missing content"
        })
    }

    if (persons.filter((person) => person.name === body.name).length > 0) {
        return response.status(400).json({
            "error": "name already exists"
        })
    }

    body.id = Math.round(Math.random() * 10000)
    persons = persons.concat(body)
    response.json(body)
})


app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter((person) => person.id != id)

    response.status(204).end()
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})