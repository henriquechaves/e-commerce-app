var Modal = function (elem) {
	this.elemento = elem;
	this.produto = this.elemento.closest('[data-produto]').data('produto');	

	this.iniciar = function(){		
		var conteudo = $.tmpl($('#scpProduto'), this.produto);

		conteudo.find('[data-moeda]').each(function(){
			var m = numeral(parseFloat($(this).html()));
			$(this).html(m.format('$ 0,0.00'));
		});

		this.elemento.fancybox({
			content: conteudo,
			groupAttr: 'data-rel',
			prevEffect: 'none',
			nextEffect: 'none',
			closeBtn: true,
			helpers: {
				title: {
					type: 'inside'
				}
			}
		});		
	};	

	this.configurar = function(){
		var obj = this;
		Layout.initImageZoom();

		$(".product-quantity .form-control").TouchSpin({
			buttondown_class: "btn quantity-down",
			buttonup_class: "btn quantity-up",
			min: 1,
			max: obj.produto.quantidade
		});
		$(".quantity-down").html("<i class='fa fa-angle-down'></i>");
		$(".quantity-up").html("<i class='fa fa-angle-up'></i>");

		$('.add2cart-modal').on('click', function(){
			var carrinho = new Carrinho();
			carrinho.adicionar(obj.produto, obj.elemento, $('#product-quantity').val());
		});
	};
};

$(document).ready(function () {	
	$(".fancybox-fast-view").each(function () {
		var modal = new Modal($(this));
		modal.iniciar();
	});

	$(".fancybox-fast-view").on('click', function(){		
		var modal = new Modal($(this));
		modal.configurar();
	});

	$('.add2cart').on('click', function(){
		var carrinho = new Carrinho();
		var numeroPedido = $('#product-quantity').length ? $('#product-quantity').val() : 1.
		carrinho.adicionar($(this).closest('[data-produto]').data('produto'), $(this), numeroPedido);
	});
});