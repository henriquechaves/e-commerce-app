module.exports = function () {
	var Banco = function () {
		this.iniciarConexao = function () {
			var stringConexao = process.env.MONGOLAB_URI !== undefined
				? process.env.MONGOLAB_URI
				: 'mongodb://localhost/ecommerce';

			this.conectar(stringConexao);
			global.bd = this;
		};

		this.conectar = function (stringConexao) {
			var mongoose = require('mongoose');

			mongoose.connect(stringConexao);
			this.banco = mongoose.connection;

			this.banco.on('error', function (erro) {
				console.log('Falha ao conectar!');
			});

			this.banco.once('open', function () {
				console.log('Conexão realizada aqui!');
			});
		};
	};

	return new Banco();
};