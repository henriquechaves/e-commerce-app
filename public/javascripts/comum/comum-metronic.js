var Carrinho = function(){	
	this.carregar = function(){
		$.ajax({
			url: '/carrinho/recuperar',
			type: 'GET'
		}).done(function(html){
			$('#div-carrinho').html(html);
			handleScrollers();

			$('#container-itens .del-goods').on('click', function(){
				remover($(this));
			});

			$('#div-carrinho').find('[data-moeda]').each(function(){
				var m = numeral(parseFloat($(this).html()));
				$(this).html(m.format('$ 0,0.00'));
			});
		});
	};

	this.adicionar = function(produto, elemento, numeroPedido){
		var numeroPedido = numeroPedido ? numeroPedido : 1;
		$.ajax({
			url: '/carrinho/adicionar',
			type: 'POST',
			data: {idProduto: produto._id, numeroPedido: numeroPedido},
			beforeSend: function(){
				elemento.data('loading-text', 'aguarde...');
				elemento.button('loading');
			}
		}).done(function(dado){
			elemento.button('reset');
			if(dado.erro){
				toastr['error'](dado.mensagensErro[0]);
			}
			else{
				toastr['success']('Produto adicionado com sucesso');
				adicionarLocal(dado.objAnonimo, elemento);
			}
		});
	};

	var adicionarLocal = function(carrinho){
		var itemCarrinho = $('.item-carrinho[data-id="'+ carrinho.ultimoAdicionado._id +'"]');

		if(itemCarrinho.length){
			itemCarrinho.find('.cart-content-count').text('x' + carrinho.ultimoAdicionado.numeroPedido);			

			var m = numeral(carrinho.ultimoAdicionado.totalPedido);
			itemCarrinho.find('.total-pedido').html(m.format('$ 0,0.00'));
		}
		else{
			var item = $.tmpl($('#scpItem'), carrinho.ultimoAdicionado);
			$('#lista-itens').append(item);

			item.find('.del-goods').on('click', function(){
				remover($(this));
			});			

			var v = item.find('[data-moeda]');
			var m = numeral(carrinho.ultimoAdicionado.totalPedido);
			v.html(m.format('$ 0,0.00'));
		}

		atualizarLista(carrinho);
		atualizarCabecalho(carrinho);
	};

	var atualizarLista = function(carrinho){		
		if(carrinho.itens.length){
			$('#container-itens').removeClass('hide').addClass('show');
		}
		else{
			$('#container-itens').removeClass('show').addClass('hide');
		}
	};

	var atualizarCabecalho = function(carrinho){		
		var m = numeral(carrinho.valorTotal);
		$('#valor-total').html(m.format('$ 0,0.00'));

		$('#numero-itens').html(carrinho.numeroItens);
	};

	var remover = function(elem){
		$.ajax({
			url: '/carrinho/remover/' + elem.closest('.item-carrinho').data('id'),
			type: 'GET'
		}).done(function(dado){
			if(dado.erro){
				toastr['error'](dado.mensagensErro[0]);
			}
			else{
				toastr['success']('Produto removido com sucesso');
				removerLocal(elem, dado.objAnonimo);
			}			
		});		
	};

	var removerLocal = function(elem, carrinho){
		var item = elem.closest('.item-carrinho');
		item.remove();
		
		atualizarTabela(elem, carrinho);		
		atualizarLista(carrinho);
		atualizarCabecalho(carrinho);
	};

	var handleScrollers = function () {
		$('.scroller').each(function () {
			var height;
			if ($(this).attr("data-height")) {
				height = $(this).attr("data-height");
			} else {
				height = $(this).css('height');
			}
			$(this).slimScroll({
                allowPageScroll: true, // allow page scroll when the element scroll is ended
                size: '7px',
                color: ($(this).attr("data-handle-color")  ? $(this).attr("data-handle-color") : '#bbb'),
                railColor: ($(this).attr("data-rail-color")  ? $(this).attr("data-rail-color") : '#eaeaea'),                
                height: height,
                alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
                railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
                disableFadeOut: true
            });
		});
	};

	var atualizarTabela = function(elem, carrinho){
		var tabela = $('#tabela-carrinho');

		if(!tabela.length){
			return
		}
		
		var linhaExcluida = tabela.find('[data-id="'+ elem.data('id') +'"]');
		linhaExcluida.closest('tr').remove();

		if(!tabela.find('tbody tr').length){
			$('#container-tabela').remove();
			$('#pagina').append($.tmpl($('#scp-pagina-vazia')));
		}

		$('.valor-total').html(carrinho.valorTotal);
	}
};

$(document).ready(function() {
	toastr.options = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-top-left",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "300",
		"timeOut": "2000",
		"extendedTimeOut": "300",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	};

	Layout.init();
	Layout.initOWL();
	LayersliderInit.initLayerSlider();
	Layout.initImageZoom();	
	Layout.initTwitter();
	Layout.initUniform();
	Layout.initSliderRange();

	Layout.initFixHeaderWithPreHeader();
	Layout.initNavScrolling();

	new Carrinho().carregar();

	numeral.language('pt-br');
	$('[data-moeda]').each(function(){
		var m = numeral(parseFloat($(this).html()));
		$(this).html(m.format('$ 0,0.00'));
	});
});