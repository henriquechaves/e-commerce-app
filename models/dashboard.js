module.exports = function (app) {
	var Dashboard = function () {
		this.totalProdutosVendidos = 0;
		this.produtoMaisVendido = 'Nenhum produto vendido';
		this.totalVendas = 0;
		this.produtosInativos = 0;
		this.produtosCadastrados = 0;
		this.produtosEstoque = 0;
		this.schema = app.schemas.dashboard;
	};

	Dashboard.prototype.preencher = function (dados, adicionarId) {
		this.totalProdutosVendidos = dados.totalProdutosVendidos;
		this.produtoMaisVendido = dados.produtoMaisVendido;
		this.totalVendas = dados.totalVendas;
		this.produtosInativos = dados.produtosInativos;
		this.produtosCadastrados = dados.produtosCadastrados;
		this.produtosEstoque = dados.produtosEstoque;
	};

	Dashboard.prototype.atualizarAposCadastroProduto = function (cb) {
		var obj = this;
		var schemaProduto = app.schemas.produto;

		obj.schema.recuperarPrimeiro(function (erro, data) {
			var dashboard = undefined;
			var criar = false;
			if (erro || !data.length) {
				dashboard = new app.models.dashboard();
				criar = true;
			}
			else {
				var dashboard = data[0];
			}

			schemaProduto.contarTotal(function (erro, data) {
				if (erro) {
					return cb(erro, null);
				}

				dashboard.produtosCadastrados = data;

				schemaProduto.contarTotalInativos(function (erro, data) {
					if (erro) {
						return cb(erro, null);
					}

					dashboard.produtosInativos = data;

					schemaProduto.contarProdutosEstoque(function (erro, data) {
						if (erro) {
							return cb(erro, null);
						}

						dashboard.produtosEstoque = data;
						criarOuAtualizar(criar, dashboard, obj, cb);
					});
				});
			});
		});
	};

	Dashboard.prototype.atualizarAposVenda = function (cb) {
		var obj = this;
		var schemaCompra = app.schemas.compra;
		var underscore = require('underscore');

		obj.schema.recuperarPrimeiro(function (erro, data) {
			var dashboard = undefined;
			var criar = false;
			if (erro || !data.length) {
				dashboard = new app.models.dashboard();
				criar = true;
			}
			else {
				var dashboard = data[0];
			}

			schemaCompra.contarTotalVendido(function (erro, data) {
				if (erro) {
					return cb(erro, null);
				}

				dashboard.totalVendas = data;

				app.schemas.produto.recuperarMaisVendidos(1, {}, function (erro, data) {
					var maisVendido = undefined;
					if (erro && !data.length) {
						maisVendido = '';
					}
					else {
						maisVendido = data[0].nome;
					}

					dashboard.produtoMaisVendido = maisVendido;
					app.schemas.produto.contarProdutosVendidos(function (data) {
						dashboard.totalProdutosVendidos = data;
						criarOuAtualizar(criar, dashboard, obj, cb);
					});
				});
			});
		});
	};

	var criarOuAtualizar = function (criar, dashboard, obj, cb) {
		if (criar) {
			var novo = dashboard.schema(dashboard);
			novo.save(dashboard, function (erro, data) {
				if (erro) {
					return cb(erro, null);
				}

				return cb(null, data);
			});
		}
		else {
			var atualizado = new Dashboard();
			atualizado.preencher(dashboard);

			obj.schema.update({ _id: dashboard._id }, atualizado, function (erro, data) {
				if (erro) {
					return cb(erro, null);
				}

				return cb(null, data);
			});
		}
	};

	return Dashboard;
};