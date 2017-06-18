var ComumSelect2 = new function () {
	this.iniciar = function(){
		$('[data-combo]').each(function(){
			var elem = $(this);

			if(elem.prop('tagName').toLowerCase() === "select"){
				iniciarSelect(elem);
			}
		});
	};

	var iniciarSelect = function(elem){
		var dados = elem.data('combo');
		var obj = {
			language: 'pt-BR',
			placeholer: dados.placeholer
		};

		if(dados.novoItem){
			obj["tags"] = true;
		}

		elem.select2(obj);
	}
}

$(document).ready(function(){
	ComumSelect2.iniciar();
});