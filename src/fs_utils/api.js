import express from 'express';
import fs, { readFileSync } from 'fs';
import MDBReader from 'mdb-reader';
import formidable from 'formidable';

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

app.post('/parse-mdb', async (req, res) => {
    const form = formidable({});
    form.parse(req, (err, fields, files) => {
        const uploadedFile = files.file[0];

        const buffer = readFileSync(uploadedFile.filepath);

        const reader = new MDBReader(buffer);

        console.log(reader.getTableNames()); 

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(uploadedFile, null, 2));
    })
});


// Start the server on port 3001
app.listen(3001)