const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/search', (req, res) => {
    // Load data from the Excel file
    const data = loadDataFromFile();

    // Filter the data based on the provided inputs
    const filteredData = data.filter(row => {
        for (let key in req.body) {
            if (req.body[key] && String(row[key]) !== req.body[key]) {
                return false;
            }
        }
        return true;
    });

    res.render('results', { matchingRows: filteredData });
});



// Function to load data from the Excel file
function loadDataFromFile() {
    // Example using xlsx library
    const xlsx = require('xlsx');
    const filePath = path.join(__dirname, 'data.xlsx')
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(worksheet);
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
