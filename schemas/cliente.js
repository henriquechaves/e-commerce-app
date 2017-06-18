module.exports = function (app) {
	var ClienteSchema = function () {
		var Schema = require('mongoose').Schema;

		var cliente = Schema({
			nome: { type: 'String', require: true },
			sobrenome: { type: 'String', require: true },
			email: { type: 'String', require: true },
			telefone: { type: 'String', require: true },
			dataCriacao: { type: 'String', require: true },
			senha: { type: 'String', require: true },
			endereco: Schema.Types.Mixed,
			enderecoEntrega: Schema.Types.Mixed
		});

		cliente.statics.recuperarTodos = function (cb) {
			return this.find(cb);
		};

		cliente.statics.recuperar = function (query, cb) {
			return this.findOne(query, cb);
		};

		cliente.statics.excluir = function (id, cb) {
			return this.findOneAndRemove({ _id: id }, cb);
		};

		return bd.banco.model('clientes', cliente);
	};

	return ClienteSchema();
};