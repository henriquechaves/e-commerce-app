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

		var l = Ladda.create(elemento[0]);
		var url = this.form.attr('action');

		$.ajax({
			type: "POST",
			url: url,
			data: req,
			dataType: 'json',			
			contentType: 'application/json',			
			beforeSend: function(){
				l.start();
			}
		}).done(function (data) {
			elemento.button('reset');
			callback(data);
			l.stop();
		});
	};
};

var SPMaskBehavior = function (val) {
	return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
},
spOptions = {
	onKeyPress: function(val, e, field, options) {
		field.mask(SPMaskBehavior.apply({}, arguments), options);
	}
};

var retornoFrete = function(dados, seletor){
	if(dados.Erro.length){
		$(seletor).html(dados.MsgErro);
		$(seletor).data('valor', 0);
		$($(seletor).data('input')).attr('disabled', 'disabled');
	}
	else{
		$(seletor).html('R$ ' + dados.Valor);
		$(seletor).data('valor', dados.Valor);
		$($(seletor).data('input')).removeAttr('disabled');
	}

	$($(seletor).data('input')).uniform();
};	

$(document).ready(function () {
	$('[data-numero]').mask('9999');
	$('[data-cep]').mask('99999999');
	$('[data-telefone]').mask(SPMaskBehavior, spOptions);

	$('.endereco-entrega').on('show.bs.collapse', function(){
		if($('#email-logado').val()) return;

		var camposEntrega = $('[data-endereco="2"]').find('input,select');

		camposEntrega.each(function(){
			var elem = $(this);
			if(!elem.val() || elem.val() === ''){
				var id = elem.attr('id').replace('2', '1');
				var itemEnderecoPessoal = $('#' + id);
				elem.val(itemEnderecoPessoal.val());
			}
		});

		$('#cep-2').blur();
	});

	$('#enviar-nova-senha').on('click', function(){
		var email = $('#email-nova-senha').val();

		if(!email || email === ''){
			toastr['error']('Digite o email');
			return;
		}

		$.ajax({
			url: '/cliente/recuperarSenha',
			type: 'POST',
			data: {email: email}
		}).done(function(dado){
			if(dado.erro){
				toastr['error'](dado.mensagensErro[0]);					
				return;
			}

			toastr['success'](dado.mensagensSucesso[0]);
		});
	});

	$('#login').on('click', function(){		
		var dados = {
			email: $('#email-login').val(),
			senha: $('#password-login').val(),
		}

		if(dados.email === '' || dados.senha === ''){
			toastr['error']('Digite todos os dados.');
			return;
		}

		var elem = this;
		var l = Ladda.create(elem);
		$.ajax({
			url: '/cliente/login',
			type: 'POST',
			data: dados,
			beforeSend: function(){				
				l.start();
			}
		}).done(function(dado){
			l.stop();

			if(dado.erro){
				toastr['error'](dado.mensagensErro[0]);
			}
			else{					
				$('#continuar-1').click();
				$('#dados-basicos').remove();
				$('#conta-existente').removeClass('col-md-6 col-sm-6').addClass('col-md-12 col-sm-12');				
				$('[data-senha]').remove();

				$('#nome').val(dado.objAnonimo.nome);
				$('#sobrenome').val(dado.objAnonimo.sobrenome);
				$('#telefone').val(dado.objAnonimo.telefone);
				$('#email-logado').val(dado.objAnonimo.email);
				$('#email').closest('.form-group').remove();

				$('#cep-1').val(dado.objAnonimo.endereco.cep);
				$('#rua-1').val(dado.objAnonimo.endereco.rua);
				$('#numero-1').val(dado.objAnonimo.endereco.numero);
				$('#complemento-1').val(dado.objAnonimo.endereco.complemento);
				$('#estado-1').val(dado.objAnonimo.endereco.estado);
				$('#cidade-1').val(dado.objAnonimo.endereco.cidade);

				$('#cep-2').val(dado.objAnonimo.enderecoEntrega.cep);
				$('#rua-2').val(dado.objAnonimo.enderecoEntrega.rua);
				$('#numero-2').val(dado.objAnonimo.enderecoEntrega.numero);
				$('#complemento-2').val(dado.objAnonimo.enderecoEntrega.complemento);
				$('#estado-2').val(dado.objAnonimo.enderecoEntrega.estado);
				$('#cidade-2').val(dado.objAnonimo.enderecoEntrega.cidade);

				$('#cep-2').blur();			
			}
		});
});

$('input[type="radio"][name="compra[tipoFrete]"]').on('change', function(){
	var elem = $(this);
	var total = $('#valor-total-compra');

	var valor = $('[data-input="#'+ elem.attr('id') +'"]').data('valor');
	var valorTotal = $('#valor-total-compra').data('valor');
	var soma = parseFloat(valor.replace(',', '.')) + parseFloat(valorTotal);

	$('[data-valor-frete]').html(valor);

	total.data('valor-soma', valorTotal + soma);
	total.html(soma);
});

$('[data-cep]').on('blur', function(){
	var elem = $(this);		
	var label = $('label[for="'+ elem.attr('id') +'"]');
	var valorAntigo = label.html();
	var calcularFrete = elem.closest('[data-endereco="2"]').length;

	if(elem.val() === elem.data('valor-anterior')){
		return;
	}

	elem.data('valor-anterior', elem.val());
	if(elem.val().length !== 8){
		toastr['error']('Não foi possível buscar o cep. Ele deve ter 8 dígitos.');
		return;
	}

	$.ajax({
		url: '/cliente/buscarCep/' + elem.val() + '/' + calcularFrete,
		type: 'GET',
		beforeSend: function(){
			label.html('Buscando dados do endereço...');
		}
	}).done(function(dado){
		if(dado.erro){
			toastr['error'](dado.mensagensErro[0]);
		}
		else{				
			label.html(valorAntigo);
			var container = elem.closest('[data-endereco]');
			var indice = container.data('endereco');

			$('#rua-' + indice).val(dado.objAnonimo.endereco.logradouro);
			$('#cidade-' + indice).val(dado.objAnonimo.endereco.localidade);
			$('#estado-' + indice).val(dado.objAnonimo.endereco.uf);
			$('#numero-' + indice).focus();

			if(!calcularFrete){
				return;
			}

			var dadosPac = dado.objAnonimo.frete[0];
			var dadosSedex = dado.objAnonimo.frete[1];
			var dadosSedex10 = dado.objAnonimo.frete[2];

			retornoFrete(dadosPac, '#valor-pac');
			retornoFrete(dadosSedex, '#valor-sedex');
			retornoFrete(dadosSedex10, '#valor-sedex-10');
		}			
	});	
});
});

window.paypalCheckoutReady = function() {
	paypal.checkout.setup('HJNBNYM6VM4KL', {
		environment: 'sandbox',
		button: ['confirmar-pedido'],
		click: function(){
			var retornoPedido = function(data){
				if(data.erro){
					for (var i = 0; i < data.mensagensErro.length; i++) {
						toastr['error'](data.mensagensErro[i]);
					}

					return;
				}

			//toastr['success'](data.mensagensSucesso[0]);
			//ir para página de sucesso
			//new Carrinho().carregar();
			//window.location.href = '/pagamento/' + data.objAnonimo._id;

			paypal.checkout.initXO();			
    		paypal.checkout.startFlow(data.objAnonimo.TOKEN);   

		};

		var mensagens = [];
		var camposObrigatorios = $('[data-obrigatorio]');

		camposObrigatorios.each(function(){			
			if($(this).val() === ''){
				mensagens.push($(this).data('obrigatorio'));
			}
		});

		var tipoFreteMarcado = $('input[name="compra[tipoFrete]"]:checked');		
		if(!tipoFreteMarcado.length){
			mensagens.push('Por favor, escolha um tipo de frete');
		}

		var modoPagamento = $('input[name="compra[modoPagamento]"]:checked')
		if(!modoPagamento.length){
			mensagens.push('Por favor, escolha um modo de pagamento');
		}

		if($('#cadastro-senha').val() !== $('#cadastro-confirmar-senha').val()){
			mensagens.push('A confirmação da está diferente da senha');	
		}

		if(mensagens.length){
			for (var i = 0; i < mensagens.length; [i++]) {
				toastr['error'](mensagens[i]);
			}

			return;
		}

		var cadastro = new Cadastro('#form-pedido');
		cadastro.postar($('#confirmar-pedido'), retornoPedido);
	}	
});
}    
