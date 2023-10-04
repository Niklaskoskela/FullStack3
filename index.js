const express = require('express')
const app = express()

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
    id: 2,
    name: 'Mauno K',
    number: '1'
   }
  ]
  
app.get('/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req,res) =>{
  const time = new Date()
  const people = `Currently contains: ${persons.length} people`
  const resBody =  `<p>${people}</p>  <p>${time}</p>`

  res.send(resBody)
})

app.get('/persons/:id', (request, response) => {
  
  const id = Number(request.params.id)
  const person = persons.find(note => note.id === id)

  if (persons) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  person = persons.filter(note => note.id !== id)

  res.status(204).end()
})

  
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})