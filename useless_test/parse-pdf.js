const fs = require('fs');
const pdfModule = require('pdf-parse');
const pdf = typeof pdfModule === 'function' ? pdfModule : (pdfModule.default || pdfModule);

let dataBuffer = fs.readFileSync('Final Mini Project-VI Report.pdf');

try {
    if (typeof pdf === 'function') {
        pdf(dataBuffer).then(function (data) {
            console.log(data.text);
        }).catch(err => console.error(err));
    } else {
        console.log("pdf-parse exports:", Object.keys(pdfModule));
    }
} catch (e) {
    console.error(e);
}
