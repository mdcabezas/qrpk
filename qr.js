import { data } from './data.js';
const $resultContainer = document.getElementById('qr-reader-results');
let lastResult, countResults = 0;

function onScanSuccess(decodedText, decodedResult) {
    if (decodedText !== lastResult) {
        ++countResults;
        lastResult = decodedText;
         console.log('decodedText', decodedText);
         console.log('decodedResult', decodedResult);
         console.log('data[decodedText]', data[decodedText]);
        if (data[decodedText]){
            $resultContainer.innerHTML  = 'VALIDO'
        } else {
            $resultContainer.innerHTML  = 'NO HABILITADO'
        }
    }
}

const html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);