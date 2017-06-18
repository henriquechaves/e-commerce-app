module.exports = function (app) {
	var CompraSchema = function () {
		var Schema = require('mongoose').Schema;

		var compra = Schema({
			valor: { type: 'Number', require: true },
			valorFrete: { type: 'Number', require: true },
			valorTotal: { type: 'Number', require: true },
			modoPagamento: { type: 'String', require: true },
			tipoFrete: { type: 'String', require: true },
			comentario: { type: 'String', require: false },
			status: { type: 'String', require: false },
			numero: { type: 'String', require: false },
			textoData: { type: 'String', require: false },
			produtos: [],
			cliente: { type: 'ObjectId', ref: 'clientes', require: false },
			data: { type: 'Date', require: true }
		});

		compra.statics.recuperarTodos = function (cb) {
			return this.find(cb);
		};

		compra.statics.recuperarTodasFinalizadas = function (cb) {
			return this.find({ status: 'FINALIZADA' }).sort('-data').exec(cb);
		};

		compra.statics.recuperar = function (query, cb) {
			return this.findOne(query).populate('cliente').exec(cb);
		};

		compra.statics.excluir = function (id, cb) {
			return this.findOneAndRemove({ _id: id }, cb);
		};

		compra.statics.contarTotalVendido = function (cb) {
			var underscore = require('underscore');

			return this.find()
				.select('valor')
				.exec(function (erro, data) {
					var sum = underscore.reduce(data, function (memo, item) { return memo + item.valor; }, 0);
					return cb(null, sum);
				});
		};

		compra.statics.recuperarProdutosVendidos = function (cb) {
			return this
				.find()
				.select('produtos')
				.exec(cb);
		};

		return bd.banco.model('compras', compra);
	};

	return CompraSchema();
};