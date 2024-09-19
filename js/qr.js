import { data } from './data.js';
const $resultContainer = document.getElementById('results');
let lastResult, countResults = 0;

function onScanSuccess(decodedText, decodedResult) {
    console.log(decodedResult)
    if (decodedText !== lastResult) {
        ++countResults;
        lastResult = decodedText;
        let exist = data[decodedText]
        if (exist){
            $resultContainer.innerHTML  = `<p class="text-center">&#128512 <span class="badge text-bg-success">¡VÁLIDO!</span> &#128512</p>
                                            <table class="table table-success table-sm">
                                              <thead>
                                                <tr class="text-center">
                                                <th scope="col">Patente</th>
                                                <th scope="col">Congregación</th>
                                                <th scope="col">Acceso</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr class="text-center">
                                                 <th scope="row">${decodedText}</th>
                                                 <td>${exist.cng}</td>
                                                 <td>${exist.rol}</td>
                                                </tr>
                                              </tbody>
                                            </table>`
        } else {
            $resultContainer.innerHTML  = '<p>&#128532 <span class="badge text-bg-danger">NO HABILITADO</span> &#128532</p>'
        }
    }
}

let qrboxFunction = function(viewfinderWidth, viewfinderHeight) {
    let minEdgePercentage = 0.7; // 70%
    let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
    let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
    return {
        width: qrboxSize,
        height: qrboxSize
    };
}

const html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: qrboxFunction },
     /* verbose= */ false );
html5QrcodeScanner.render(onScanSuccess);