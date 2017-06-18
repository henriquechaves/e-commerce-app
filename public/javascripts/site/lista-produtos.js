$(document).ready(function () {
	$('[data-numero]').mask('9999');
	
	$('#select-ordem').on('change', function () {
		var elem = $(this);

		if(elem.val() === 'nome'){
			$('#ordenar-nome').click();
		}
		else{
			$('#ordenar-preco').click();
		}
	});

	$('#ordenar-preco').on('click', function (argument) {
		window.location = $(this).attr('href');
	});

	$('#ordenar-nome').on('click', function (argument) {
		window.location = $(this).attr('href');
	});

	$('#btn-filtrar').on('click', function () {
		var botao = $('#btn-filtrar');
		var filtro = botao.attr('href').replace('_menor', $('#menor-preco').val()).replace('_maior', $('#maior-preco').val());
		botao.attr('href', filtro)
		
		return true;
	})

	var atualizarCampos = function () {
		$("#menor-preco").val($("#slider-range").slider("values", 0));
		$("#maior-preco").val($("#slider-range").slider("values", 1));		
	};

	$( "#slider-range" ).slider({
		range: true,
		min: 0,
		max: 9999,
		values: [ 0, 9999 ]	
	}).on( "slidechange", function(event, ui) {
		atualizarCampos();
	});

	$("#slider-range").slider("values",[$('#menor-preco').val(), $('#maior-preco').val()]);
});