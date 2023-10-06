//IMPORTS
const express = require('express')
const app = express()
const cors = require('cors')


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

//MONGOOSE

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url =
`mongodb+srv://nk:${password}@cluster0.onekweo.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url).then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)



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