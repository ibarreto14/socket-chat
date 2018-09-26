/////////////////////////////////////////////////////
// FUNCIONES PARA RENDERIZAR USUARIOS

var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala   = params.get('sala');

//REFERENCIAS DE JQUERY

var divUsuarios = $('#divUsuarios');
var frmEnviar   = $('#frmEnviar');
var txtMsj      = $('#txtMsj');
var divChatbox  = $('#divChatbox');

function renderizarUsuarios(personas) {	
	var html = '';

	html ='<li>';
    html +=    '<a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + ' </span></a>';
    html +='</li>';

    for (var i = 0; i < personas.length; i++) {
    	html += '<li>';
	    html +=     '<a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ personas[i].nombre +' <small class="text-success">online</small></span></a>';
	    html += '</li>';
    }

    divUsuarios.html(html);
}


//RENDERIZAR MENSAJES
function renderizarMensajes(mensaje, yo){
	var html = '';
	var fecha = new Date(mensaje.fecha);
	var hora  = fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();
	var adminClass = 'info';

	if(mensaje.nombre === 'Administrador'){
		adminClass = 'danger';
	}

	if(yo){
		html = '<li class="reverse">';
		html+=     '<div class="chat-content">';
		html+=         '<h5>Yo:</h5>';
		html+=     	'<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
		html+=     '</div>';
		html+=     '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
		html+=     '<div class="chat-time">' + hora + '</div>';
		html+= '</li>';
	}else{
		html ='<li class="aniamted fadeIn">';
		if(mensaje.nombre !== 'Administrador'){
			html+=    '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
		}
		html+=    '<div class="chat-content">';
		if(mensaje.nombre !== 'Administrador'){
			html+=        '<h5>' + mensaje.nombre + ':</h5>';
		}
		html+=        '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
		html+=    '</div>';
		html+=    '<div class="chat-time">' + hora + '</div>';
		html+='</li>';
	}	                              
    
    divChatbox.append(html);
}


function scrollBottom() {
    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


//LISTENERS

divUsuarios.on('click', 'a', function(){

	var id = $(this).data('id');
	if(id){
		console.log(id);
	}
});



txtMsj.keypress(function(e) {
  if(e.which == 13) {
  	e.preventDefault();
    enviarMjsChat();
  }
});


$('#frmEnviar').on('click', '#btnEnviarMsj', function(){
	enviarMjsChat();
});

function enviarMjsChat(){
	console.log('se lanzó este evento!!!');
	if(txtMsj.val().trim().length === 0){
		return;
	}

	//Enviar información
	socket.emit('crearMensaje', {
	    nombre: nombre,
	    mensaje: txtMsj.val()
	}, function(mensaje) {	    
	    renderizarMensajes(mensaje, true);
	    scrollBottom();
	    txtMsj.val('').focus();
	});
}


//FUNCIÓN PARA DESPLEGAR NOTIFICACIÓN CUANDO ALGUIEN SE CONECTA
function alertNotifInOutUsr(mensaje){

	$.notify({
		icon: 'assets/images/users/user.png',
		//title: msj,
		message: mensaje.mensaje
	},{
		type: 'minimalist',
		delay: 10000,
		icon_type: 'image',
		template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
			'<img data-notify="icon" class="img-circle pull-left">' +
			//'<span data-notify="title">{1}</span>' +
			'<span data-notify="message">{2}</span>' +
		'</div>'
	});

	loadIonSoundInOut();
	ion.sound.play("dont-think-so");
}


//FUNCIÓN PARA DESPLEGAR NOTIFICACIÓN CUANDO SE RECIBE UN MENSAJE
function alertNotifMsj(mensaje){

	$.notify({
		icon: 'assets/images/users/user.png',
		//title: msj,
		message: mensaje.mensaje
	},{
		type: 'minimalist',
		delay: 10000,
		icon_type: 'image',
		template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
			'<img data-notify="icon" class="img-circle pull-left">' +
			//'<span data-notify="title">{1}</span>' +
			'<span data-notify="message">{2}</span>' +
		'</div>'
	});

	loadIonSoundMsj();
	ion.sound.play("appointed");
}


//INICIALIZACIÓN DEL PLUGGIN PARA LA NOTIFICACIÓN AUDITIVA
function loadIonSoundInOut(){
	var archivoNotf = 'dont-think-so';

    ion.sound({
            sounds: [                
                {name: archivoNotf}
            ],
            path: "../assets/sounds/",
            preload: true,
            volume: 1.0
    });
}


function loadIonSoundMsj(){
	var archivoNotf = 'appointed';
    ion.sound({
            sounds: [                
                {name: archivoNotf}
            ],
            path: "../assets/sounds/",
            preload: true,
            volume: 1.0
    });
}