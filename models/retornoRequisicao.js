module.exports = function (app) {
	var Retorno = function (erro, objAnonimo, mensagemSucesso) {
		this.objAnonimo = objAnonimo !== undefined ? objAnonimo : {};
		this.erro = erro !== undefined ? erro : true;

		if (this.erro && this.erro.tipo === 'ERRO') {
			this.mensagensErro = ['Ocorreu um erro imprevisto :('];
			console.log(erro);
		}
		else if (this.erro && this.erro.tipo === 'ERRO_NEGOCIO') {
			this.mensagensErro = erro.mensagem ? [erro.mensagem] : erro.mensagens;
		}
		else {
			this.mensagensSucesso = [mensagemSucesso];
		}
	};

	Retorno.prototype.retornarJson = function (res) {
		var status = 200;

		if (this.erro && this.tipo === 'ERRO') {
			status = 500;
		}

		res.status(status);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(this));
	};

	Retorno.prototype.renderizar = function (res, pagina, model) {
		model.mensagensErro = this.mensagensErro;
		model.mensagenSucesso = this.mensagenSucesso;

		res.render(pagina, { model: model });
	};

	return Retorno;
};