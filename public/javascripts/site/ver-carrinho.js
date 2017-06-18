$(document).ready(function (argument) {	
	$('.remover-tabela').on('click', function(){
		var id = $(this).data('id');
		var itemCarrinho = $('#container-itens [data-id="'+ id +'"]');
		itemCarrinho.find('.del-goods').click();

		var tabela = $(this).closest('table');
		$(this).closest('tr').remove();

		if(!tabela.find('tbody').find('tr').length){
			var html = $.tmpl($('#scp-pagina-vazia'));
			$('#pagina').html(html);
		}
	});
});