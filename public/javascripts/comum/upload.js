var Arquivo = new function(){
	this.uploadImagem = function (fileInput, url, callback) {
		var isExtensaoValida = function(extensao){
			if(extensao.toLowerCase() === 'jpg' || extensao.toLowerCase() === 'png') return true;

			return false;
		};

		var validarLargura = function(arquivo, cb){
			var largura = 0;
			var altura = 0;
			var larguraMinima =  parseInt(fileInput.data('largura-minima'));
			var alturaMinima =  fileInput.data('altura-minima') ? parseInt(fileInput.data('altura-minima')) : 0;
			var _URL = window.URL || window.webkitURL;
			
			img = new Image();
			img.onload = function () {
				largura = this.width;
				altura = this.heigth;
				var continuar = false;

				if(largura < larguraMinima){
					Notificacao.notificar(['A imagem deve ter mais de '+ larguraMinima +' px de largura'], 'error');
				}
				else if(altura < alturaMinima){
					Notificacao.notificar(['A imagem deve ter mais de '+ alturaMinima +' px de altura'], 'error');
				}
				else{
					continuar = true;
				}

				var crop = larguraMinima !== 0 && alturaMinima === 0;

				if(continuar){
					cb(largura, crop);
				}
			};
			img.src = _URL.createObjectURL(arquivo);
		}
		
		var arquivo = fileInput[0].files[0];

		if(arquivo === undefined) return;

		if(!isExtensaoValida(arquivo.name.split('.').pop())){
			Notificacao.notificar(['Extensão inválida'], 'error');
			return;
		}

		validarLargura(arquivo, function(largura, crop){
			var formData = new FormData();
			formData.append("arquivo", arquivo);
			formData.append("url", fileInput.val());
			
			url = url === null ? '/admin/upload' : url;
			var label = $('#' + fileInput.data('id-label'));
			var valorAntigo = label.text();

			$.ajax({  
				type: "POST",  
				url: url + '/' + largura.toString() + '/' + crop,  
				data: formData,  
				processData: false,
				contentType: false,
				beforeSend: function(){
					label.text('Realizando upload...');
				}
			}).done(function(url){
				label.text(valorAntigo);
				callback(null, url);
			}); 
		});		
	};
};