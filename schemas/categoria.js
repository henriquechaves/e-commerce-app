module.exports = function (app) {
	var CategoriaSchema = function () {
		var Schema = require('mongoose').Schema;

		var categoria = Schema({
			nome: { type: 'String', require: true },
			produtos: [{ type: 'ObjectId', ref: 'produtos' }]
		});

		categoria.statics.recuperarTodas = function (cb) {
			return this.find().sort('nome').exec(cb);
		};

		categoria.statics.recuperar = function (query, cb) {
			return this.findOne(query, cb);
		};

		categoria.statics.excluir = function (id, cb) {
			return this.findOneAndRemove({ _id: id }, cb);
		};

		return bd.banco.model('categorias', categoria);
	};

	return CategoriaSchema();
};