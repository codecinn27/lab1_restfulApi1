const { log, error } = require('console');
const express = require('express')
const app = express()
const port = 3000
const bcrypt = require('bcrypt')
const saltRounds = 12;

let dbUsers = [
    {
        username: "Hee",
        password: "1UTeM@PPPK",
        email: "b02211@utem.com"
    }]

//bcrypt the store password into hashPassword
for(let i =0 ; i<dbUsers.length; i++){
    dbUsers[i].password = bcrypt.hashSync(dbUsers[i].password, saltRounds)
}

app.use(express.json());
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get('/', (req, res) => res.send('Hello World!'))


//register using async await function

async function register(newusername, newpassword, newemail){
    const ifFound = dbUsers.find(data => data.username === newusername)
    if(ifFound){
        return Promise.resolve("Username already exists");
    }else{
        const hashPass = await bcrypt.hash(newpassword, saltRounds)
        dbUsers.push({
            username : newusername,
            password : hashPass,
            email : newemail
        })
        return Promise.resolve("Register Success")
    }
}

// method 1
app.post('/register', async (req,res)=>{
    const data = req.body;
    const result = await register(data.username, data.password, data.email)
    res.send(result)

})

//method 2
app.post('/register2', (req,res)=>{
    const data = req.body;
    //res.send() do not function properly with asynchorous nature
    register(data.username, data.password, data.email)
        .then((result) => res.send(result))
        .catch((error) => res.send(error));
})


async function login(name, pass){
    console.log(`Someone is trying to login with ${name}`);
    const correct = dbUsers.find(data => data.username == name)
    if(correct){
        const passValid = await bcrypt.compare(pass, correct.password)
        if(passValid){
            return correct
        }else{
            return Promise.resolve("Incorrect password input")
        }
    }else{
        return Promise.resolve("User not found")
    }
}

//prefer this way
app.post('/login', (req, res)=>{
    let data = req.body;
    login(data.username, data.password)
        .then((result)=> res.send(result))
        .catch((error) => res.send(error))
})

//method 2
app.post('/login2', async (req,res)=>{
    let data = req.body;
    const result = await login(data.username, data.password)
    res.send(result)
})