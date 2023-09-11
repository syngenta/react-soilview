import express from 'express';
import fs from 'fs';

const app = express();

// Use the following header for the page
app.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin","*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
});

// Entry page
app.get('/', (req, res) => {
    res.send('test')
});

app.get('/parse-mdb', (req, res) => {
    console.log('here');
    // res.send(fs.readFileSync('C:\\example\\example.txt',{encoding:'utf8'}))
    res.send('file test');
});


// Start the server on port 3001
app.listen(3001)