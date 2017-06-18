$(document).ready(function(){
	$('#btnSalvarUsuario').on('click', function(){
		var retornoCadastroUsuario = function(data){
			if(data.erro){
				Notificacao.notificar(data.mensagensErro, 'error');
				return;
			}

			Notificacao.notificar(data.mensagensSucesso);	

			$('#tBodyUsuarios').append($.tmpl($('#scpUsuarios'), data.objAnonimo));
		};

		var valido = true;
		$('#formUsuario').find('input').each(function(){
			if($(this).val() === ''){
				valido = false;
			}
		});

		if(!valido){
			Notificacao.notificar(['Preencha todos os dados'], 'error');
			return;
		}

		var cadastro = new Cadastro('#formUsuario');
		cadastro.postar($(this), retornoCadastroUsuario);
	});

	$('body').on('click', '[data-excluir-usuario]', function(){
		var id = $(this).data('excluir-usuario');
		var linha = $(this).closest('tr');

		$.ajax({
			url: 'usuario/excluir/' + id,
			method: 'GET'
		}).done(function(data){
			if(!data.erro){
				linha.remove();
				Notificacao.notificar(data.mensagensSucesso);
			}
			else{
				Notificacao.notificar(data.mensagensErro, 'error');}
			});
	});
});
