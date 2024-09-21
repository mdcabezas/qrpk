document.getElementById('tituloReporte').addEventListener('change', function () {
    const extraFields = document.getElementById('extraFields');
    
    // Mostrar los campos adicionales si "Patente no registrada" está seleccionada
    if (this.value === 'Patente no registrada') {
        extraFields.style.display = 'block';
    } else {
        extraFields.style.display = 'none';
    }
});

document.getElementById('enviarBtn').addEventListener('click', function () {
    // Obtener los valores del formulario
    const tituloReporte = document.getElementById('tituloReporte').value;
    const sectorEstacionamiento = document.getElementById('sectorEstacionamiento').value;
    const descripcion = document.getElementById('descripcion').value;
    const nombreVoluntario = document.getElementById('nombreVoluntario').value;
 

    // Variables adicionales solo si se seleccionó "Patente no registrada"
    let patente = '';
    let congregacion = '';
    let nombreConductor = '';

    if (tituloReporte === 'Patente no registrada') {
        patente = document.getElementById('patente').value;
        congregacion = document.getElementById('congregacion').value;
        nombreConductor = document.getElementById('nombreConductor').value;

        // Verificar que estos campos no estén vacíos
        if (!patente || !congregacion || !nombreConductor) {
            alert("Por favor complete todos los campos adicionales para 'Patente no registrada'.");
            return;
        }
    }

    // Verificar que los campos generales no estén vacíos
    if (!tituloReporte || !descripcion || !nombreVoluntario) {
        alert("Por favor complete todos los campos.");
        return;
    }

    // Crear el string en el formato solicitado
    let reporte = `
#######################################
${tituloReporte}
---------------------------------------
Sector: ${sectorEstacionamiento}
---------------------------------------
Descripción: ${descripcion}
---------------------------------------
Nombre voluntario: ${nombreVoluntario}
---------------------------------------`;

    // Si es "Patente no registrada", agregar los campos adicionales
    if (tituloReporte === 'Patente no registrada') {
        reporte += `
Patente: ${patente}
Congregación: ${congregacion}
Nombre del conductor: ${nombreConductor}
---------------------------------------`;
    }

    // Redirigir a WhatsApp con el mensaje
    const mensajeWhatsapp = encodeURIComponent(reporte);
    const whatsappURL = `https://wa.me/56947499964?text=${mensajeWhatsapp}`;

    // Redirigir al usuario a WhatsApp
    window.open(whatsappURL, '_blank');

    // Cerrar el modal después de enviar
    const modal = bootstrap.Modal.getInstance(document.getElementById('reporteModal'));
    modal.hide();
});