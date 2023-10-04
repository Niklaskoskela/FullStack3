const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

var morgan = require('morgan')
morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
   {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
   },
   {
    id: 2,
    name: 'Jaakkoppi',
    number: '030-143457'
   },
   {
    id: 3,
    name: 'Mauno K',
    number: '1'
   }
  ]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/info', (req,res) =>{
  const time = new Date()
  const people = `Currently contains: ${persons.length} people`
  const resBody =  `<p>${people}</p>  <p>${time}</p>`

  res.send(resBody)
})

app.get('/api/persons/:id', (request, response) => {
  
  const id = Number(request.params.id)
  const person = persons.find(note => note.id === id)

  if (persons) {
    response.json(person)
  } else {
    response.status(404).end()
  }
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

  if (persons.findIndex(person => person.name === body.name) != -1) {
    console.log("not unique")
    return response.status(400).json({ 
      error: 'name not unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  console.log("new person " + person.name)
  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})