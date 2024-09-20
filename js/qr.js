import { data } from './data.js';

const $resultContainer = document.getElementById('results');
const $manualCodeInput = document.getElementById('manualCodeInput');
const $submitManualCode = document.getElementById('submitManualCode');
let lastResult, countResults = 0;
const $input = document.getElementById('clearButton').addEventListener('click', clearInput);


// Presiona botos "Busqueda por QR"
document.getElementById('search-qr').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent default link behavior
  document.querySelector(".busqueda-manual").style.display = "none";// Ocultar la sección 'busqueda-manual'
  document.querySelector(".busqueda-qr").style.display = "block";// Mostrar la sección 'busqueda-qr'
 document.querySelector('.results').style.display = "none";// Ocultar la sección 'results'
});

// Presiona botos "Busqueda por patente"
document.getElementById("search-manual").addEventListener("click", function(event) {
  event.preventDefault(); // Evita la recarga de la página
  document.querySelector(".busqueda-qr").style.display = "none";// Ocultar la sección 'busqueda-qr'
  document.querySelector(".busqueda-manual").style.display = "block"; // Mostrar la sección 'busqueda-manual'
  document.querySelector('.results').style.display = "none";// Ocultar la sección 'results'
});

// Initial state
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.busqueda-qr').style.display = "none";// Ocultar la sección 'busqueda-qr'
    document.querySelector('.busqueda-manual').style.display = "none";// Ocultar la sección 'busqueda-manual'

});



// Función para mostrar los resultados en pantalla
function displayResult(decodedText) {

  document.querySelector('.results').style.display = "block";// Mostrar la sección 'results'
    if (decodedText !== lastResult) {
        ++countResults;
        lastResult = decodedText;

        let exist = data[decodedText];
        if (exist) {
            $resultContainer.innerHTML = `<p class="text-center">&#128512 <span class="badge text-bg-success">¡AUTORIZADO!</span> &#128512</p>
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
                                          </table>`;
        } else {
            $resultContainer.innerHTML = `<p class="text-center mt-3">&#128532 <span class="badge text-bg-danger">NO HABILITADO</span> &#128532</p>
            <table class="table table-sm">
            <thead>
              <tr class="text-center table-danger">
                <th scope="col">Patente</th>
                <th scope="col">Congregación</th>
                <th scope="col">Acceso</th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-center">
                <th scope="row">${decodedText}</th>
                <td>NO REGISTRADO</td>
                <td>SIN AUTORIZACION</td>
              </tr>
            </tbody>
          </table>`;
        }
    }
}

// Función que se ejecuta cuando se escanea un código QR
function onScanSuccess(decodedText, decodedResult) {
    console.log(decodedResult);
    displayResult(decodedText);
 
}

// Función para manejar la entrada manual de código
function handleManualInput() {
 
    const manualCode = $manualCodeInput.value.trim().toUpperCase();
    if (manualCode) {
        displayResult(manualCode);
    }
}

// Asociar la función de manejar la entrada manual al botón
$submitManualCode.addEventListener('click', handleManualInput);

// Función para calcular el tamaño del cuadro QR
let qrboxFunction = function(viewfinderWidth, viewfinderHeight) {
    let minEdgePercentage = 0.5; // 50%
    let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
    let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
    return {
        width: qrboxSize,
        height: qrboxSize
    };
}

// Configuración del escáner
let config = {
    fps: 10,
    qrbox: qrboxFunction,
    rememberLastUsedCamera: true,
    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
};

// Inicializar el escáner QR
const html5QrcodeScanner = new Html5QrcodeScanner("reader", config, false);
html5QrcodeScanner.render(onScanSuccess);


// Función para seleccionar la cámara trasera y empezar el escaneo
function startScannerWithBackCamera() {
  Html5Qrcode.getCameras().then(cameras => {
      // Filtrar para encontrar la cámara trasera
      const backCamera = cameras.find(camera => camera.label.toLowerCase().includes('back'));
      
      // Si se encuentra la cámara trasera, inicializamos el escáner con ella
      if (backCamera) {
          let config = {
              fps: 10,
              qrbox: qrboxFunction,
              rememberLastUsedCamera: true,
              supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
          };

          // Inicializar el escáner QR con la cámara trasera
          const html5QrcodeScanner = new Html5QrcodeScanner("reader", config, false);
          html5QrcodeScanner.render(onScanSuccess, backCamera.id);
      } else {
          console.error("No se encontró la cámara trasera.");
      }
  }).catch(err => {
      console.error("Error al obtener las cámaras: ", err);
  });
}

//Funcion  para limpiar input
function clearInput() {
  document.getElementById('manualCodeInput').value = '';
};

// Llamar a la función para iniciar el escáner con la cámara trasera
startScannerWithBackCamera();
