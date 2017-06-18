var Menu = function (valor) {
	var valor = valor;

	this.marcar = function(){
		$('list-group .active').removeClass('active');
		$('[data-valor="'+ valor +'"]').addClass('active');
	};	
}

var Cadastro = function (seletorForm) {	
	$('[data-texto-html]').each(function(){
		var valor = tinyMCE.get($(this).attr('id')).getContent();
		$(this).val(valor);
	});

	this.form = $(seletorForm);

	this.postar = function (elemento, callback) {
		var req = JSON.stringify(this.form.serializeJSON({
				parseBooleans: true,
				parseNumbers: true,
				customTypes:{
					decimal: function(str){
						return parseFloat(str.replace('.','').replace(',', '.'));
					}
				}
			}));

		var url = this.form.attr('action');

		$.ajax({
			type: "POST",
			url: url,
			data: req,
			dataType: 'json',			
			contentType: 'application/json',			
			beforeSend: function(){elemento.button('loading'); }
		}).done(function (data) {
			elemento.button('reset');
			callback(data);			
		});
	}
}

var Notificacao = new function(){
	this.notificar = function(mensagens, tipo, posicao){

		tipo = tipo !== undefined ? tipo : 'success';
		posicao = posicao !== undefined ? posicao : 'toast-top-right';

		toastr.options = {
			"closeButton": true,			
			"newestOnTop": true,			
			"positionClass": posicao,		
		}

		for (var i = 0; i < mensagens.length; i++) {
			toastr[tipo](mensagens[i]);
		}
	};	
}

var UsuarioLogado = new function(){	
	this.atualizarNome = function(){
		if(!$('#nomeUsuarioLogado').length){
			return;
		}

		$.ajax({
			url: '/admin/usuario/dadosUsuario',
			type: 'GET'
		}).done(function(data){
			$('#nomeUsuarioLogado').text(data.objAnonimo.nome);
		});
	};
}

$(document).ready(function(){
	var menu = new Menu($('[data-menu-marcado]').data('menu-marcado'));
	menu.marcar();

	UsuarioLogado.atualizarNome();

	numeral.language('pt-br');
	$('[data-moeda]').each(function(){
		var m = numeral(parseFloat($(this).html()));
		$(this).html(m.format('$ 0,0.00'));
	});

	$('[data-datetime]').each(function(){
		var elem = $(this);
		var data = new Date(elem.text());
		var dataFormatada = data.getDay().toString() + '/' + (data.getMonth() + 1).toString() + '/' + data.getFullYear().toString();
		var horaFormatada = data.getHours().toString() + ':' + data.getMinutes().toString();

		var result = dataFormatada +  ' às ' + horaFormatada;
		elem.text(result);
	});
});