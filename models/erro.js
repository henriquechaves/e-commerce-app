module.exports = function (app) {
	var Erro = function (mensagem, tipo, log, mensagens) {
		this.mensagem = mensagem;
		this.tipo = tipo;
		this.log = log;
		this.mensagens = mensagens;
	};

	return Erro;
};