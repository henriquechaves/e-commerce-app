module.exports = function (app) {
	var LojaController = {
		index: function (req, res) {
			var underscore = require('underscore');

			app.schemas.categoria.recuperarTodas(function (erro, categorias) {
				var listaCategorias = undefined;

				if (erro || !categorias) {
					listaCategorias = [];
					console.log(erro);
				}
				else {
					listaCategorias = categorias;
				}

				app.schemas.produto.recuperarProdutosDestaque(function (erro, data) {
					var produtosDestaque = undefined;
					var produtosMaisVendidos = undefined;

					if (erro || !data) {
						console.log(erro);
						return res.render('home/sem-produto');
					}
					else {
						produtosDestaque = data;
					}

					app.schemas.produto.recuperarMaisVendidos(10, { destaque: false, ativo: true }, function (erro, data) {
						if (erro || !data) {
							console.log(erro);
							produtosMaisVendidos = [];
						}
						else {
							produtosMaisVendidos = data;
						}

						var model = {
							produtosDestaque: produtosDestaque,
							categorias: listaCategorias,
							produtosMaisVendidos: produtosMaisVendidos
						};
						return res.render('home/index', model);
					});
				});
			});
		},
		produtos: function (req, res) {
			var pagina = 1;
			var maximo = 9;
			var ordenacao = 'nome';

			var menorPreco = 0;
			var maiorPreco = 9999;
			var busca = undefined;

			var url = require('url');
			var partes = url.parse(req.url, true);
			var query = partes.query;

			if (query.pag) {
				pagina = parseInt(query.pag);
			}

			if (query.ord) {
				ordenacao = query.ord;
			}

			if (query.menorp) {
				menorPreco = parseInt(query.menorp);
				menorPreco = isNaN(menorPreco) ? 0 : menorPreco;
			}

			if (query.maiorp) {
				maiorPreco = parseInt(query.maiorp);
				maiorPreco = isNaN(maiorPreco) ? 9999 : maiorPreco;
			}

			if (query.busca) {
				busca = query.busca;
			}

			app.schemas.categoria.recuperarTodas(function (erro, categorias) {
				if (erro) {
					console.log(erro);
				}

				new app.models.produto().recuperarDadosListagem(maximo, pagina, ordenacao, menorPreco, maiorPreco, query.cat, busca, function (erro, data) {
					var underscore = require('underscore');
					var produtos = [];
					var categoria = null;

					if (erro) {
						console.log(erro);
						produtos = [];
					}

					produtos = data.produtos;

					if (!produtos.length) {
						return res.render('home/sem-produto');
					}

					if (query.cat) {
						categoria = underscore.find(categorias, function (item) { return item._id.toString() === query.cat })
					}

					var model = {
						produtos: app.models.util.chunk(maximo, produtos),
						categorias: categorias,
						categoria: categoria,
						total: data.total,
						numeroPaginas: Math.ceil(data.total / maximo),
						paginaAtual: pagina,
						totalItens: data.produtos.length,
						ordenacao: ordenacao,
						menorPreco: menorPreco,
						maiorPreco: maiorPreco,
						busca: busca
					};

					res.render('home/lista-produtos', model);
				});
			});
		},

		sobre: function (req, res) {
			res.render('home/sobre');
		},

		contato: function (req, res) {
			res.render('home/contato');
		},

		enviarEmail: function (req, res) {
			var opcoes = {
				nomeTemplate: 'contato',
				email: req.body.email,
				nome: req.body.nome,
				destinatario: process.env.CONTATO_EMAIL,
				model: {
					email: req.body.email,
					nome: req.body.nome,
					mensagem: req.body.mensagem,
				}
			};

			app.models.util.enviarEmail(opcoes, function (erro, data) {
				if (erro) {
					console.log(erro);
					return res.render('home/contato', { erro: 'Ocorreu um erro ao enviar o email' });
				}

				return res.render('home/contato', { sucesso: 'Mensagem enviada!' });
			});
		},

		devolucao: function (req, res) {
			res.render('home/devolucao');
		},

		pagamento: function (req, res) {
			res.render('home/pagamento');
		},

		frete: function (req, res) {
			res.render('home/frete');
		},

		entrega: function (req, res) {
			res.render('home/entrega');
		},

		verProduto: function (req, res) {
			app.schemas.produto.recuperar({ _id: req.params.id }, function (erro, produto) {
				res.render('home/ver-produto', { model: produto });
			});
		},

		recuperarCarrinho: function (req, res) {
			var carrinho = req.session.carrinho ? req.session.carrinho : new app.models.carrinho();

			res.render('home/carrinho', carrinho);
		},

		adicionarAoCarrinho: function (req, res) {
			var sessao = new app.models.sessao(req);
			var carrinho = new app.models.carrinho();
			sessao.criarCarrinho();

			var carrinhoSessao = req.session.carrinho;
			carrinho.preencher(carrinhoSessao);

			app.schemas.produto.recuperar({ _id: req.body.idProduto }, function (erro, produto) {
				if (erro) {
					var retorno = new app.models.retornoRequisicao(erro, null);
					return retorno.retornarJson(res);
				}
				if (!produto) {
					var retorno = new app.models.retornoRequisicao(new app.models.erro('Produto não encontrado', 'ERRO_NEGOCIO'), null);
					return retorno.retornarJson(res);
				}

				carrinho.atualizar(req.body.numeroPedido, produto, function (erro, carrinho) {
					var retorno = {};
					if (erro) {
						retorno = new app.models.retornoRequisicao(erro);
					}
					else {
						retorno = new app.models.retornoRequisicao(null, carrinho);
						sessao.atualizarCarrinho(carrinho);
					}

					return retorno.retornarJson(res);
				});
			});
		},

		removerDoCarrinho: function (req, res) {
			var sessao = new app.models.sessao(req);
			var carrinho = new app.models.carrinho();
			var carrinhoSessao = req.session.carrinho ? req.session.carrinho : new app.models.carrinho();
			carrinho.preencher(carrinhoSessao);

			app.schemas.produto.recuperar({ _id: req.params.idProduto }, function (erro, produto) {
				if (erro) {
					var retorno = new app.models.retornoRequisicao(erro, null);
					return retorno.retornarJson(res);
				}

				var id = produto ? produto._id.toString() : req.params.idProduto;
				carrinho.removerItem(id, function (erro, carrinho) {
					var retorno = new app.models.retornoRequisicao(null, carrinho);
					sessao.atualizarCarrinho(carrinho);
					return retorno.retornarJson(res);
				});
			});
		},

		verCarrinho: function (req, res) {
			var carrinho = new app.models.carrinho();
			var carrinhoSessao = req.session.carrinho ? req.session.carrinho : new app.models.carrinho();
			carrinho.preencher(carrinhoSessao);

			res.render('home/ver-carrinho', carrinho);
		},

		resumo: function (req, res) {
			var url = require('url');
			var partes = url.parse(req.url, true);
			var query = partes.query;
			console.log(req.params);

			if (query.token) {
				app.schemas.compra.recuperar({ _id: req.params.idCompra }, function (erro, compra) {
					if (erro || !compra) {
						return res.redirect('/compra/finalizar?erro=true');
					}

					var paypal = new app.models.paypal();
					paypal.recuperarDadosCheckout(query.token, function (erro, dado) {
						if (erro || dado.ACK !== 'Success') {
							console.log(dado);
							return res.redirect('/compra/finalizar?erroPaypal=true');
						}
						else if (dado.payerstatus === 'verified') {
							console.log(dado);
							return res.redirect('/compra/finalizar?erroPaypal=true');
						}
						else {
							var opcoes = {
								valorTotal: compra.valorTotal,
								token: query.token,
								payerId: query.PayerID
							};

							paypal.finalizarPagamento(opcoes, function (erro, dado) {
								if (erro || dado.ACK !== 'Success') {
									console.log(dado);
									return res.redirect('/compra/finalizar?erroPaypal=true');
								}

								var c = new app.models.compra();
								c.finalizar(compra);
								c.atualizarDadosProduto(compra.produtos);
								c.enviarEmails(compra);

								var sessao = new app.models.sessao(req);
								sessao.removerCarrinho();

								return res.render('home/resumo.ejs', compra);
							});
						}
					});
				});
			}
			else {
				return res.render('home/nao-encontrado.ejs');
			}
		},

		finalizarCompra: function (req, res) {
			var url = require('url');
			var partes = url.parse(req.url, true);
			var query = partes.query;

			var carrinho = new app.models.carrinho();
			var carrinhoSessao = req.session.carrinho ? req.session.carrinho : new app.models.carrinho();
			carrinho.preencher(carrinhoSessao);

			if (!carrinho.itens.length) {
				return res.redirect('/carrinho/ver');
			}

			console.log(query);
			var model = {
				carrinho: carrinho,
				estados: app.models.util.recuperarEstados(),
				erro: query.erro,
				erroPaypal: query.erroPaypal
			}
			res.render('home/finalizar-compra', model);
		},
	};

	return LojaController;
};