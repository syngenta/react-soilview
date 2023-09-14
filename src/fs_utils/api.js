import express from 'express';
import fs from 'fs';
import formidable from 'formidable';
import unzipper from 'unzipper';
import path from 'path';
import { fileURLToPath } from 'url';
import gdal from 'gdal';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

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


const parseShapeFile = (soilMapFolder) => {
    const spatialDir = path.join(soilMapFolder, 'spatial');
    const shapefilePattern = /\.shp$/i;

    const files = fs.readdirSync(spatialDir);
    let geojson = {
        type: 'FeatureCollection',
        features: []
    }
    files.forEach(file => {
        const filePath = path.join(spatialDir, file);
        if (shapefilePattern.test(file) && fs.statSync(filePath).isFile()) {
            const dataset = gdal.open(filePath);
            const layer = dataset.layers.get(0);
            layer.features.forEach(feature => {
                const geometry = feature.getGeometry();
                const properties = feature.fields.toObject();
                geojson = {
                    ...geojson,
                    features: [...geojson.features, {
                        type: 'Feature',
                        geometry: JSON.parse(geometry.toJSON()),
                        properties,
                      }]
                }
            })
            dataset.close();
        }
    });

    return geojson;

}

app.post('/parse-mdb', async (req, res) => {
    const form = formidable({});
    const tempDir = path.join(__dirname, 'temp');
    // only extract uploaded file if folder doesn't already exists
    let newDir = false;
    if (!fs.existsSync(tempDir)) {
        newDir = true;
        fs.mkdirSync(tempDir);
    }
    form.parse(req, (err, fields, files) => {
        const uploadedFile = files.file[0];

        if (newDir) {
            fs.createReadStream(uploadedFile.filepath)
            .pipe(unzipper.Extract({path: tempDir}))
            .on('close', () => {
                fs.unlinkSync(uploadedFile.filepath);
                const folderName = path.join(tempDir, uploadedFile.originalFilename.split('.')[0]);
                const geojson = parseShapeFile(folderName)
    
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(geojson, null, 2));
            });
        } else {
            const folderName = path.join(tempDir, uploadedFile.originalFilename.split('.')[0]);
            const geojson = parseShapeFile(folderName)

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(geojson, null, 2));
        }
    })
});


// Start the server on port 3001
app.listen(3001)