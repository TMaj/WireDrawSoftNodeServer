const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 8001;
const db = require('./src/data/db');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors());

const logErrorAndSendResponse = (res, error, errorMsg, errCode) => {
    console.log(`\x1b[31m ${errorMsg}`);
    console.log(error);
    console.log('\x1b[0m');

    res.statusCode = errCode;
    res.send(errorMsg);
}

app.get('/presets', async (req, res) => {
    try {
        const items = await db.getAllPresets();
        res.send(items);

    } catch(error) {
        const errorMsg = 'Error occured while getting presets'; 
        logErrorAndSendResponse(res, error, errorMsg, 500);
    } 
});

app.post('/presets', async (req, res) => {  
    try {
        const preset = await db.addPreset(req.body.preset);
    
        console.log(`preset with id: ${preset.id} created`);
        return res.send(preset);

    } catch(error) {
        const errorMsg = 'Error occured while posting preset'; 
        logErrorAndSendResponse(res, error, errorMsg, 400);
    } 
});

app.delete('/presets/:presetId', async (req, res) => {  
    try {
        await db.deletePreset(req.params.presetId);
        const items = await db.getAllPresets();
        return res.send(items);

    } catch(error) {
        const errorMsg = 'Error occured while deleting preset'; 
        logErrorAndSendResponse(res, error, errorMsg, 400);
    } 
});

app.get('/session', async (req, res) => { 
    try {
        res.send(await db.getAllSessions()); 
    } catch(error) {
        const errorMsg = 'Error occured while getting sessions'; 
        logErrorAndSendResponse(res, error, errorMsg, 500);
    } 
});

app.get('/statistics/:begin/:end', async (req, res) => { 
    try {
        console.log('Getting statistics');
        console.log(await db.getStatisticsBetween(req.params.begin, req.params.end));
        res.send(await db.getStatisticsBetween(req.params.begin, req.params.end));
    } catch(error) {
        const errorMsg = 'Error occured while getting statistics'; 
        logErrorAndSendResponse(res, error, errorMsg, 400);
    } 
});

app.get('/settings', async (req, res) => { 
    try {
        fs.readFile('./settings.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                res.status("500").send('File read failed');
                return;
            } 
            console.log(jsonString);
            res.send(jsonString);
        });
    } catch(error) {
        const errorMsg = 'Error occured while getting settings'; 
        logErrorAndSendResponse(res, error, errorMsg, 500);
    } 
});
app.post('/settings', async (req, res) => { 
    try {
        console.log(req.body.settings);   
        if (req.body.settings === undefined) {
            res.status("400").send('Bad settings posted');
            return;
        }
        const settings = JSON.stringify(req.body.settings); 

        fs.writeFile('./settings.json', settings, err => {
            if (err) {
                console.log('Error writing file', err)
                res.status("400").send('Error writing file');
            } else {
                console.log('Successfully wrote file')
                res.send(req.body.settings);
            }
        }); 
    } catch(error) {
        const errorMsg = 'Error occured while posting settings'; 
        logErrorAndSendResponse(res, error, errorMsg, 400);
    } 
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));