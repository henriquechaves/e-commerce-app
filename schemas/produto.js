module.exports = function (app) {
	var ProdutoSchema = function () {
		var Schema = require('mongoose').Schema;

		var produto = Schema({
			nome: { type: 'String', require: true },
			descricao: { type: 'String', require: false },
			observacao: { type: 'String', require: false },
			preco: { type: 'Number', require: true },
			ativo: { type: 'Boolean', require: true },
			peso: { type: 'Number', require: false },
			largura: { type: 'Number', require: false },
			altura: { type: 'Number', require: false, default: 0 },
			comprimento: { type: 'Number', require: false },
			quantidade: { type: 'Number', require: false, default: 0 },
			urlFotoLista: { type: 'String', require: true },
			urlFotoPainel: { type: 'String', require: true },
			destaque: { type: 'Boolean', require: true },
			totalVendido: { type: 'Number', require: true, default: 0 },
			categoria: { type: 'ObjectId', ref: 'categorias' },
		});

		produto.statics.recuperarTodos = function (cb) {
			return this.find()
				.populate('categoria')
				.sort('nome')
				.exec(cb);
		};

		produto.statics.recuperarPorIds = function (ids, cb) {
			return this.find({ _id: { $in: ids } })
				.populate('categoria')
				.sort('nome')
				.exec(cb);
		};

		produto.statics.recuperarAtivos = function (maximo, pagina, ordenacao, menorPreco, maiorPreco, categoria, busca, cb) {
			var query = this.find({ ativo: true })
				.where({ preco: { $gte: menorPreco, $lte: maiorPreco } });

			if (categoria) {
				query = query.where({ categoria: categoria });
			}

			if (busca) {
				query = query.where({ nome: new RegExp(busca, "i") });
			}

			return query.skip((pagina - 1) * maximo)
				.limit(maximo)
				.populate('categoria')
				.sort(ordenacao)
				.exec(cb);
		};

		produto.statics.recuperarProdutosDestaque = function (cb) {
			var obj = this;

			return this.find({ ativo: true }).populate('categoria').exec(function (erro, data) {
				if (erro) {
					return cb(erro, null);
				}

				if (!data.length) {
					return cb(new app.models.erro('Não existem produtos ativos', 'ERRO_NEGOCIO'), null);
				}

				var underscore = require('underscore');

				var destaques = underscore.where(data, { destaque: true });

				return cb(null, destaques);
			});
		};

		produto.statics.recuperar = function (query, cb) {
			return this
				.findOne(query)
				.populate('categoria')
				.exec(cb);
		};

		produto.statics.excluir = function (id, cb) {
			return this.findOneAndRemove({ _id: id }, cb);
		};

		produto.statics.contarTotal = function (cb) {
			return this.find().count(cb);
		};

		produto.statics.contarTotalInativos = function (cb) {
			return this.find({ ativo: false }).count(cb);
		};

		produto.statics.contarTotalAtivos = function (categoria, cb) {
			if (categoria) {
				return this.find({ ativo: true, categoria: categoria }).count(cb);
			}

			return this.find({ ativo: true, }).count(cb);
		};

		produto.statics.recuperarMaisVendidos = function (maximo, query, cb) {
			return this.find(query)
				.limit(maximo)
				.sort('-totalVendido')
				.exec(cb);
		};

		produto.statics.recuperarQuantidade = function (query, cb) {
			return this.findOne(query)
				.select('quantidade')
				.exec(cb);
		};

		produto.statics.contarProdutosVendidos = function (cb) {
			var underscore = require('underscore');

			this.find()
				.select('totalVendido')
				.exec(function (erro, data) {
					if (erro) {
						return cb(0)
					}
					else {
						var sum = underscore.reduce(data, function (memo, item) {
							return memo + item.totalVendido;
						}, 0);

						return cb(sum);
					}
				});
		};

		produto.statics.contarProdutosEstoque = function (cb) {
			this.find({ ativo: true }).exec(function (erro, data) {
				if (erro) {
					cb(erro, null);
				}

				var underscore = require('underscore');

				var sum = underscore.reduce(data, function (memo, item) {
					return memo + item.quantidade;
				}, 0);

				return cb(null, sum);
			});
		};

		return bd.banco.model('produtos', produto);
	};

	return ProdutoSchema();
};