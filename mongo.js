//IMPORTS
const app = require('express')
const mongoose = require('mongoose')



//MONGOOSE
if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
  
  const password = process.argv[2]
  
  const url =
    `mongodb+srv://nk:${password}@cluster0.onekweo.mongodb.net/phonebook?retryWrites=true&w=majority`
  
  mongoose.set('strictQuery', false)
  mongoose.connect(url)

  //MONGOOSE END
  

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
  const Person = mongoose.model('Person', personSchema)


if (process.argv.length===3) {
  console.log(Person)
  Person.find({}).then(result => {
    console.log("result")
    console.log(result)

    mongoose.connection.close()
    }) 
}

if (process.argv.length===5) {
  const newName = process.argv[3]
  console.log("adding", newName)
  const newNumber = process.argv[4]
  console.log(newNumber)

  const person = new Person({
    name: newName,
    number: newNumber,
  })
  console.log(person)
  
  person.save().then(result => {
    console.log('Person added succesfully!')
    mongoose.connection.close()
  })
}