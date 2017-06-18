module.exports = function (app) {
	var ClienteController = {
		login: function (req, res) {
			var cliente = new app.models.cliente();
			cliente.preencher(req.body);

			cliente.autenticar(function (erro, cliente) {
				var retorno = {};
				if (erro) {
					retorno = new app.models.retornoRequisicao(erro, null);
				}
				else {
					retorno = new app.models.retornoRequisicao(null, cliente);
				}

				return retorno.retornarJson(res);
			});
		},

		confirmarPedido: function (req, res) {
			var cliente = new app.models.cliente();
			var retorno = {};

			var cepEntrega = req.body.cliente.enderecoEntrega.cep;
			cliente.preencher(req.body.cliente);
			cliente.criar(req.body.cliente.criarConta, req.body.cliente.emailLogado, function (erro, cliente) {
				if (erro) {
					retorno = new app.models.retornoRequisicao(erro, null);
					return retorno.retornarJson(res);
				}

				var compra = new app.models.compra();
				var carrinho = new app.models.carrinho();
				var carrinhoSessao = req.session.carrinho ? req.session.carrinho : new app.models.carrinho();
				carrinho.preencher(carrinhoSessao);

				compra.preencher(req.body.compra);
				compra.realizar(carrinho, cliente, cepEntrega, function (erro, compra) {
					if (erro) {
						retorno = new app.models.retornoRequisicao(erro, null);
						return retorno.retornarJson(res);
					}
					else {
						var paypal = new app.models.paypal();
						paypal.realizarExpressCheckout(compra, function (erro, dado) {
							if (erro) {
								retorno = new app.models.retornoRequisicao(erro, null);
							}
							else {
								retorno = new app.models.retornoRequisicao(null, dado, 'Compra registrada!');
							}

							return retorno.retornarJson(res);
						});
					}
				});
			});
		},

		buscarCep: function (req, res) {
			var cliente = new app.models.cliente();
			cliente.buscarCep(req.params.cep, function (erro, data) {
				var retorno = {};
				var model = {
					endereco: {},
					frete: {}
				};

				if (erro) {
					retorno = new app.models.retornoRequisicao(erro, null);
					return retorno.retornarJson(res);
				}

				if (!parseInt(req.params.calcularFrete)) {
					model.endereco = data;
					retorno = new app.models.retornoRequisicao(null, model);
					return retorno.retornarJson(res);
				}

				var carrinho = new app.models.carrinho();
				var carrinhoSessao = req.session.carrinho ? req.session.carrinho : new app.models.carrinho();
				carrinho.preencher(carrinhoSessao);

				model.endereco = data;

				cliente.calcularFrete(req.params.cep, carrinho, undefined, function (erro, data) {
					if (erro) {
						retorno = new app.models.retornoRequisicao(erro, null);
					}
					else {
						model.frete = data;
						retorno = new app.models.retornoRequisicao(erro, model);
					}

					return retorno.retornarJson(res);
				});
			});
		},

		recuperarSenha: function (req, res) {
			var email = req.body.email;
			var retorno = {};

			app.schemas.cliente.recuperar({ email: email }, function (erro, data) {
				if (erro) {
					retorno = new app.models.retornoRequisicao(erro, null);
					return retorno.retornarJson(res);
				}
				else if (!data) {
					retorno = new app.models.retornoRequisicao(new app.models.erro('Usuário não encontrado', 'ERRO_NEGOCIO'), null);
					return retorno.retornarJson(res);
				}
				else {
					var cliente = new app.models.cliente();
					cliente.preencher(data, true);
					cliente.gerarNovaSenha(function (erro, dado) {
						if (erro) {
							retorno = new app.models.retornoRequisicao(erro, null);
						}
						else {
							retorno = new app.models.retornoRequisicao(null, null, 'Sua nova senha foi enviada para seu email. Favor verificar.');
						}

						return retorno.retornarJson(res);
					});
				}
			});
		},
	};

	return ClienteController;
};