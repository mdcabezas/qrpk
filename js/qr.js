import { data } from './data.js';
const $resultContainer = document.getElementById('qr-reader-results');
let lastResult, countResults = 0;

function onScanSuccess(decodedText, decodedResult) {
    if (decodedText !== lastResult) {
        ++countResults;
        lastResult = decodedText;
        let exist = data[decodedText]
        if (exist){
            $resultContainer.innerHTML  = `<p>&#128512 <span class="badge text-bg-success">¡VÁLIDO!</span></p>
                                            <table class="table">
                                              <thead>
                                                <tr>
                                                <th scope="col">Patente</th>
                                                <th scope="col">Congregación</th>
                                                <th scope="col">Acceso</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr class="table-success">
                                                <th scope="row">${decodedText}</th>
                                                 <td>${exist.cng}</td>
                                                 <td>${exist.rol}</td>
                                                </tr>
                                              </tbody>
                                            </table>
        } else {
            $resultContainer.innerHTML  = '<p>&#128532 <span class="badge text-bg-danger">NO HABILITADO</span></p>'
        }
    }
}

const html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);