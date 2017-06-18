module.exports = function (app) {
	var Sessao = function(req){
		this.usuario = {};
		this.carrinho = {};
		this.contexto = req;
	};

	Sessao.prototype.removerUsuario = function() {
		this.contexto.session.usuario = null;
	};

	Sessao.prototype.adicionarUsuario = function(usuario){
		this.contexto.session.usuario = usuario;
	};

	Sessao.prototype.removerCarrinho = function() {
		this.contexto.session.carrinho = null;
	};

	Sessao.prototype.criarCarrinho = function(){
		if(!this.contexto.session.carrinho){
			this.contexto.session.carrinho = new app.models.carrinho();
		}
	};

	Sessao.prototype.atualizarCarrinho = function(carrinho){
		this.contexto.session.carrinho = carrinho;
	};

	return Sessao;
}