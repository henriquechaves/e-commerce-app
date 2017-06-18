module.exports = function (app) {
	var UsuarioSchema = function () {
		var Schema = require('mongoose').Schema;

		var usuario = Schema({
			nome: { type: 'String', require: true },
			email: { type: 'String', require: true },
			dataCriacao: { type: 'String', require: true },
			senha: { type: 'String', require: true }
		});

		usuario.statics.recuperarTodos = function (cb) {
			return this.find(cb);
		};

		usuario.statics.recuperar = function (query, cb) {
			return this.findOne(query, cb);
		};

		usuario.statics.excluir = function (id, cb) {
			return this.findOneAndRemove({ _id: id }, cb);
		};

		return bd.banco.model('usuarios', usuario);
	};

	return UsuarioSchema();
};