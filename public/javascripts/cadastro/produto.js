var Mascaras = new function(){
	this.iniciar = function(){
		$('#foto-produto-lista').filestyle({input:false, buttonText: 'Escolha uma foto de lista para o produto', iconName: 'glyphicon-picture'});
		$('#foto-produto-painel').filestyle({input:false, buttonText: 'Escolha uma foto de painel para o produto', iconName: 'glyphicon-picture'});

		$('[data-numero]').mask('9999');
		$('[data-dinheiro]').mask('000.000.000.000.000,00', {reverse: true});
	};
};

var Formulario = new function(){
	var retornoCadastro = function(data){
		if(data.erro){				
			Notificacao.notificar(data.mensagensErro, 'error');
			return;
		}

		Notificacao.notificar(data.mensagensSucesso);
		window.location.href = '/admin/produtos';
	};

	var validar = function(){
		var camposObrigatorios = $('[data-obrigatorio]');
		var valido = true;

		camposObrigatorios.each(function(){
			var campo = $(this);

			if(!campo.val()){
				Notificacao.notificar([campo.data('obrigatorio')], 'error');
				valido = false;
			}
		});
		
		return valido;
	};

	this.persistir = function(elem){
		if(!validar()) return;

		var cadastro = new Cadastro('#form-produto');
		cadastro.postar(elem, retornoCadastro);
	}
};

var Foto = new function(){
	this.mostrarEsconder = function(elem){
		var dados = elem.data('dados');
		var div = $(dados.divFoto);

		if(div.is(':visible')){
			div.slideUp();
			elem.text(dados.textoMostrar);
		}
		else{
			div.slideDown();
			elem.text(dados.textoEsconder);
		}		
	};
};

$(document).ready(function () {
	Mascaras.iniciar();
	
	$('[data-salvar]').on('click', function(e){
		e.preventDefault();
		Formulario.persistir($(this));
	});

	$('input:file').on('change', function(e){		
		var sucesso = true;
		var idHidden = '#' + $(this).data('id-url');
		Arquivo.uploadImagem($(this), null, function(erro, data){
			if(erro){
				e.preventDefault();
			}

			$(idHidden).val(data.objAnonimo.url);
		});		
	});

	$('#ver-foto-lista').on('click', function(){
		Foto.mostrarEsconder($(this));
	});

	$('#ver-foto-painel').on('click', function(){
		Foto.mostrarEsconder($(this));
	});
});