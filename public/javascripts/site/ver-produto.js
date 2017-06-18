$(document).ready(function () {
	var produto = $('[data-produto]').data('produto');

	$(".product-quantity .form-control").TouchSpin({
		buttondown_class: "btn quantity-down",
		buttonup_class: "btn quantity-up",
		min: 1,
		max: produto.quantidade
	});
	$(".quantity-down").html("<i class='fa fa-angle-down'></i>");
	$(".quantity-up").html("<i class='fa fa-angle-up'></i>");
});