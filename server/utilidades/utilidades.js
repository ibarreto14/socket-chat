
const crearMensaje = (nombre, mensaje, tipo) => {
	return {
		nombre,
		mensaje,
		fecha: new Date().getTime(),
		tipo
	}
}

module.exports = {
	crearMensaje
}