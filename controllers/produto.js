module.exports = function (app) {
	var ProdutoController = {
		index: function (req, res) {
			var produtos = undefined;

			app.schemas.produto.recuperarTodos(function (erro, data) {
				if (erro) {
					produtos = [];
				}

				produtos = data;
				res.render('produto/index.ejs', { produtos: produtos });
			});
		},
		novo: function (req, res) {
			var categorias = undefined;

			app.schemas.categoria.recuperarTodas(function (erro, data) {
				if (erro) {
					categorias = [];
				}

				var model = {
					produto: new app.models.produto(),
					categorias: data
				};

				res.render('produto/cadastro.ejs', model);

			});
		},
		edicao: function (req, res) {
			var categorias = undefined;
			var produto = undefined;

			app.schemas.categoria.recuperarTodas(function (erro, data) {
				if (erro) {
					categorias = [];
				}
				else {
					categorias = data;
				}

				app.schemas.produto.recuperar({ _id: req.params.id }, function (erro, data) {
					if (erro) {
						produto = new app.models.produto();
					}
					else {
						produto = data;
					}

					var model = {
						produto: produto,
						categorias: categorias
					};

					res.render('produto/cadastro.ejs', model);
				});
			});
		},
		cadastro: function (req, res) {
			var isEdicao = req.body._id;
			var produto = new app.models.produto();
			produto.preencher(req.body, isEdicao);

			produto.inserirOuAtualizar(req.body.nomeCategoria, isEdicao, function (erro, produto) {
				var retorno = {};
				if (erro) {
					retorno = new app.models.retornoRequisicao(erro, null);
				}
				else {
					retorno = new app.models.retornoRequisicao(null, produto, 'Produto cadastrado com sucesso!');
				}

				return retorno.retornarJson(res);
			});
		},
		ativarOuInativar: function (req, res) {
			app.schemas.produto.recuperar({ _id: req.params.id }, function (erro, produto) {
				if (erro) {
					console.log(erro);
					return res.redirect('/admin/produtos');
				}

				var obj = new app.models.produto();
				obj.preencher(produto, true);
				obj.ativarOuInativar(req.params.status, function (erro, data) {
					if (erro) {
						console.log(erro);
					}

					return res.redirect('/admin/produtos');
				});
			});
		},

		destacarOuNao: function (req, res) {
			app.schemas.produto.recuperar({ _id: req.params.id }, function (erro, produto) {
				if (erro) {
					console.log(erro);
					return res.redirect('/admin/produtos');
				}

				var obj = new app.models.produto();
				obj.preencher(produto, true);
				obj.destacarOuNao(req.params.status, function (erro, data) {
					if (erro) {
						console.log(erro);
					}

					return res.redirect('/admin/produtos');
				});
			});
		},
	};

	return ProdutoController;
};