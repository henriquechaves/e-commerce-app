module.exports = function (app) {
	var DashboardSchema = function () {
		var Schema = require('mongoose').Schema;

		var dashboard = Schema({
			totalProdutosVendidos: { type: 'Number', require: true },
			produtoMaisVendido: { type: 'String', require: true },
			totalVendas: { type: 'Number', require: true },
			produtosInativos: { type: 'Number', require: true },
			produtosCadastrados: { type: 'Number', require: true },
			produtosEstoque: { type: 'Number', require: true },
		});

		dashboard.statics.recuperarPrimeiro = function (cb) {
			return this.find().limit(1).exec(cb);
		};

		dashboard.statics.recuperarTodas = function (cb) {
			return this.find().sort('nome').exec(cb);
		};

		dashboard.statics.recuperar = function (query, cb) {
			return this.findOne(query, cb);
		};

		dashboard.statics.excluir = function (id, cb) {
			return this.findOneAndRemove({ _id: id }, cb);
		};

		return bd.banco.model('dashboards', dashboard);
	};

	return DashboardSchema();
};