//IMPORTS
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')


//MIDDLEWARE
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

//MORGAN
var morgan = require('morgan')
morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))




  //SERER REQUESTS
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  }
  )
})

app.get('/api/info', (req,res) =>{
  Person.find({}).then(persons => {
    res.send(
      `<p> Database has ${persons.length} people</p><p>${new Date()}</p>`
    )
  }
  )
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  console.log(""+persons.length)
  persons = persons.filter(note => note.id !== id)
  console.log('-->' + persons.length)
  res.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 10000);
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)

  if (!body.name || body.name === "") {
    console.log("no name")
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number || body.number === "") {
    console.log("no number")
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }


  const newPerson = new Person({
    name: body.name,
    number: body.number
  })

  newPerson.save().then(saved => {
    response.json(saved)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})