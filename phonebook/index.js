const express = require('express');
const app = express();

const morgan = require('morgan');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body),
    ].join(' ')
  }));

let data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// GET All
app.get('/api/persons', (req, res) => {
    try {
        if(data) {
            res.json({
                'data' : data,
            })
        } else {
            res.status(404).json({
                'message' : 'data not found',
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            'message' : 'error',
            'error' : error,
        })
    }
})

app.get('/api/persons/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let rperson;
        for(const person of data) {
            if(person.id === id) {
                rperson = {...person};
            }
        }
    
        if(rperson) {
            res.json({
                'data' : rperson,
            });
        } else {
            res.status(404).json({
                'message' : 'id not found',
            })
        }        
    } catch (error) {
        console.error('error', error);
        res.status(500).json({
            'error' : error,
        })
    }

})

app.delete('/api/persons/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let dperson;
        for(const person of data) {
            if(person.id === id) {
                dperson = {...person};
            }
        }

        if(dperson) {
            let ndata = [...data].filter((person) => {
                return person.id !== dperson.id;
            })

            data = [...ndata];

            res.json({
                'message' : 'person deleted',
                'data' : dperson,
            })
        } else {
            res.status(404).json({
                'message' : 'id not found'
            })
        }
    } catch (error) {
        console.error('error', error);
        res.status(500).json({
            'error' : error,
        })
    }
})

app.post('/api/persons', (req, res) => {
    try {
        const name = req.body.name;
        const number = req.body.number;

        if(name && number) {
            for(const person of data) {
                if(person.name === name) {
                    res.status(422).json({
                        'message' : 'Name must be unique',
                    })
                    return;
                }
            }

            const person = {
                id : Math.floor(Math.random() * 1000),
                name : name,
                number : number,
            }

            let ndata = [...data];
            ndata.push(person);
            data = [...ndata];

            res.json({
                'message' : 'added new entry',
                'data' : person,
            })
        } else {
            res.status(422).json({
                'message' : 'Missing number or name',
            })
        }
    } catch (error) {
        console.error('error', error);
        res.status(500).json({
            'error' : error,
        })
    }
})

// GET info
app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${data.length} people
              ${new Date()}` )
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
})