//IMPORTS
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')


//MIDDLEWARE
app.use(express.static('build'))
app.use(cors())
app.use(express.json())

//MORGAN
var morgan = require('morgan')
morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


//SERER REQUESTS
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }
  )
})

app.get('/api/info', (request,response,next) => {
  Person.find({}).then(persons => {
    response.send(
      `<p> Database has ${persons.length} people</p><p>${new Date()}</p>`
    )
  }
  ).catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {

  Person.findByIdAndRemove(request.params.id).then( () => {
    response.status(204).end()
  }
  ).catch((error) => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body)

  if (!body.name || body.name === '') {
    console.log('no name')
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number || body.number === '') {
    console.log('no number')
    return response.status(400).json({
      error: 'number missing'
    })
  }


  const newPerson = new Person({
    name: body.name,
    number: body.number
  })

  newPerson.save()
    .then(saved => {
      response.json(saved)
    })
    .catch(
      error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query'  })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})