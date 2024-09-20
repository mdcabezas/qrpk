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
                                            <table class="table table-sm">
                                              <thead>
                                                <tr class="text-center table-success">
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
            $resultContainer.innerHTML  = '<p class="text-center mt-3">&#128532 <span class="badge text-bg-danger">NO HABILITADO</span> &#128532</p>'
        }
    }
}

let qrboxFunction = function(viewfinderWidth, viewfinderHeight) {
    let minEdgePercentage = 0.9; // 90%
    let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
    let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
    return {
        width: qrboxSize,
        height: qrboxSize
    };
}

Html5Qrcode.getCameras().then(cameras => {
  // Filtrar para encontrar la cámara trasera
  const backCamera = cameras.find(camera => camera.label.toLowerCase().includes('back'));
  
  // Si se encuentra la cámara trasera, inicializamos el escáner con ella
  if (!backCamera) {
      let config = {
          fps: 10,
          qrbox: qrboxFunction,
          rememberLastUsedCamera: true,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      };

      // Inicializar el escáner QR con la cámara trasera
      const html5QrcodeScanner = new Html5QrcodeScanner("reader", config, false);
      // html5QrcodeScanner.render(onScanSuccess, backCamera.id);
      html5QrcodeScanner.render(onScanSuccess);

      // Después de renderizar el escáner, ocultamos el selector de cámara
      const cameraSelect = document.querySelector("#reader #reader__dashboard #reader__dashboard_section");
      console.log("==>",cameraSelect, "<==")
      // if (cameraSelect) {
      //   // cameraSelect.remove();
      //   cameraSelect.style.display = 'none';
      // }
  } else {
      console.error("No se encontró la cámara trasera.");
  }
}).catch(err => {
  console.error("Error al obtener las cámaras: ", err);
});