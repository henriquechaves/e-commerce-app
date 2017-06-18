module.exports = function (app) {
	var UsuarioController = {
		login: function (req, res) {
			res.render('usuario/login', { mensagem: null });
		},
		logar: function (req, res) {
			var usuario = new app.models.usuario();
			usuario.preencher(req.body);

			usuario.autenticar(function (erro, data) {
				if (erro) {
					var retorno = new app.models.retornoRequisicao(erro, null);
					return retorno.renderizar(res, 'usuario/login', {});
				}
				else {
					var sessao = new app.models.sessao(req);
					sessao.adicionarUsuario(data);
					return res.redirect('/admin');
				}
			});
		},
		sair: function (req, res) {
			var sessao = new app.models.sessao(req);
			sessao.removerUsuario();

			res.redirect('/admin/login');
		},
		buscarDadosUsuarioLogado: function (req, res) {
			var retorno = new app.models.retornoRequisicao(null, req.session.usuario);
			return retorno.retornarJson(res);
		},
		dashboard: function (req, res) {
			app.schemas.dashboard.recuperarPrimeiro(function (erro, data) {
				var dashboard = undefined;

				if (erro || !data.length) {
					dashboard = new app.models.dashboard();
				}
				else {
					dashboard = data[0];
				}
				res.render('usuario/dashboard', { dashboard: dashboard });
			});
		},
		index: function (req, res) {
			var usuario = new app.models.usuario();
			usuario.schema.recuperarTodos(function (erro, data) {
				res.render('usuario/index', { usuarios: data });
			});
		},
		excluir: function (req, res) {
			var usuario = new app.models.usuario();
			var retorno = new app.models.retornoRequisicao(usuario, false);

			usuario.excluir(req.params.id, function (erro, data) {
				var retorno = {};
				if (erro) {
					retorno = new app.models.retornoRequisicao(erro, null);
				}
				else {
					retorno = new app.models.retornoRequisicao(null, usuario, 'Usuário excluído com sucesso!');
				}

				return retorno.retornarJson(res);
			});
		},
		cadastrar: function (req, res) {
			var usuario = new app.models.usuario();

			usuario.preencher(req.body);
			usuario.inserir(function (erro, usuario) {
				var retorno = {};
				if (erro) {
					retorno = new app.models.retornoRequisicao(erro, null);
				}
				else {
					retorno = new app.models.retornoRequisicao(null, usuario, 'Usuário cadastrado com sucesso!');
				}

				return retorno.retornarJson(res);
			});
		}
	}

	return UsuarioController;
}