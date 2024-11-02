import { data } from './data.js';

// const $resultContainer = document.getElementById('results');
const $manualCodeInput = document.getElementById('manualCodeInput');
const $submitManualCode = document.getElementById('submitManualCode');
const $clearButton = document.getElementById('clearButton');
let lastResult, countResults = 0;
// const $input = document.getElementById('clearButton').addEventListener('click', clearInput);

// Initial state
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.busqueda-qr').style.display = "none";// Ocultar la sección 'busqueda-qr'
  document.querySelector('.busqueda-manual').style.display = "none";// Ocultar la sección 'busqueda-manual'
  document.querySelector(".disclaimer").style.display = "block";
});

// Presiona boton "Busqueda por QR"
document.getElementById('search-qr').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent default link behavior
  document.querySelector(".busqueda-manual").style.display = "none";// Ocultar la sección 'busqueda-manual'
  document.querySelector(".busqueda-qr").style.display = "block";// Mostrar la sección 'busqueda-qr'
  document.querySelector(".head").style.display = "none";// Ocultar la sección 'head'
 //document.querySelector(".results").style.display = "none";// Ocultar la sección 'results'
 document.querySelector(".disclaimer").style.display = "none";// Ocultar la sección 'disclaimer'
 // Inicia cámara
 startScannerWithBackCamera();
});

// Presiona botos "Busqueda por patente"
document.getElementById("search-manual").addEventListener("click", function(event) {
  event.preventDefault(); // Evita la recarga de la página
  document.querySelector(".busqueda-qr").style.display = "none";// Ocultar la sección 'busqueda-qr'
  document.querySelector(".busqueda-manual").style.display = "block"; // Mostrar la sección 'busqueda-manual'
  //document.querySelector(".results").style.display = "none";// Ocultar la sección 'results'
  document.querySelector(".disclaimer").style.display = "none";// Ocultar la sección 'disclaimer'
  document.querySelector(".head").style.display = "block";// Mostrar la sección 'head'
});

function displayResult(decodedText) {
  // Mostrar el modal
  let modal = new bootstrap.Modal(document.getElementById('resultsModal'), {
      keyboard: false
  });

  if (decodedText !== lastResult) {
    ++countResults;
    lastResult = decodedText;

    let exist = data[decodedText];
    let modalContent = '';

    if (exist) {
      modalContent = `
        <p class="text-center">&#128512 <span class="badge text-bg-success">¡AUTORIZADO!</span> &#128512</p>
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
      modalContent = `
        <p class="text-center mt-3">&#128532 <span class="badge text-bg-danger">NO HABILITADO</span> &#128532</p>
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

    // Actualizar el contenido del modal
    document.getElementById('modalResultsContainer').innerHTML = modalContent;

    // Mostrar el modal
    modal.show();
  }
}


// Función que se ejecuta cuando se escanea un código QR
function onScanSuccess(decodedText) {
    displayResult(formattedCode(decodedText));
}

  // Formatea el texto: elimina espacios, guiones y caracteres no alfanuméricos
function formattedCode(text){
  return text.replace(/[-\s\W_]+/g, '').trim().toUpperCase();
}

// Función para manejar la entrada manual de código
function handleManualInput() {
  // Obtiene el valor del input y lo fromatea
  const manualCode = formattedCode($manualCodeInput.value);
  
  // Verifica si el código formateado no está vacío
  if (!manualCode){
    alert("¡Por favor Ingrese una Patente!");
    return;  
  }

  // Muestra el resultado
  displayResult(manualCode);
  clearInput();
}

// Borrar contenido del input manual
$clearButton.addEventListener('click', clearInput)

// Asociar la función de manejar la entrada manual al botón
$submitManualCode.addEventListener('click', handleManualInput);

// Función para calcular el tamaño del cuadro QR
let qrboxFunction = function(viewfinderWidth, viewfinderHeight) {
    let minEdgePercentage = 0.7; //70%
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
  $manualCodeInput.value = '';
};

document.getElementById('closeModalBtn').addEventListener('click', function() {
  // Forzar el cierre del modal manualmente usando Bootstrap Modal API
  const modal = bootstrap.Modal.getInstance(document.getElementById('resultsModal'));
  if (modal) {
      modal.hide(); // Cerrar el modal forzadamente
  }
});

// Llamar a la función para iniciar el escáner con la cámara trasera
// startScannerWithBackCamera();
