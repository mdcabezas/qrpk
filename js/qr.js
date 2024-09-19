import { data } from './data.js';
const $resultContainer = document.getElementById('qr-reader-results');
let lastResult, countResults = 0;

function onScanSuccess(decodedText, decodedResult) {
    if (decodedText !== lastResult) {
        ++countResults;
        lastResult = decodedText;
        let exist = data[decodedText]
        if (exist){
            $resultContainer.innerHTML  = `<p>&#128512 ¡VÁLIDO!</p>
                                           <p>Patente: ${decodedText}</p>
                                           <p>Congregación: ${exist.cng}</p>
                                           <p>Acceso: ${exist.rol}</p>`
        } else {
            $resultContainer.innerHTML  = '<p>&#128532 NO HABILITADO</p>'
        }
    }
}

const html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);