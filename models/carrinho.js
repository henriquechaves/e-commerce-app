module.exports = function (app) {
	var Carrinho = function () {
		this.itens = [];
		this.ultimoAdicionado = {};

		this.valorTotal = 0;
		this.numeroItens = 0;
		this.classe = 'hide';
	};

	Carrinho.prototype.calcularTotal = function () {
		var underscore = require('underscore');
		var soma = underscore.reduce(this.itens, function (memo, item) {
			return memo + item.totalPedido;
		}, 0);

		return soma;
	};

	Carrinho.prototype.calcularNumeroItens = function () {
		var underscore = require('underscore');
		var soma = underscore.reduce(this.itens, function (memo, item) {
			return memo + item.numeroPedido;
		}, 0);

		return soma;
	};

	Carrinho.prototype.calcularPeso = function () {
		var underscore = require('underscore');
		var soma = underscore.reduce(this.itens, function (memo, item) {
			return memo + item.peso;
		}, 0);

		return soma;
	};

	Carrinho.prototype.calcularAltura = function () {
		var underscore = require('underscore');
		var soma = underscore.reduce(this.itens, function (memo, item) {
			return memo + item.altura;
		}, 0);

		return soma;
	};

	Carrinho.prototype.calcularLargura = function () {
		var underscore = require('underscore');
		var soma = underscore.reduce(this.itens, function (memo, item) {
			return memo + item.largura;
		}, 0);

		return soma;
	};

	Carrinho.prototype.calcularComprimento = function () {
		var underscore = require('underscore');
		var soma = underscore.reduce(this.itens, function (memo, item) {
			return memo + item.comprimento;
		}, 0);

		return soma;
	};

	Carrinho.prototype.atualizarClasse = function () {
		return this.itens.length ? "show" : "hide";
	};

	Carrinho.prototype.preencher = function (carrinho) {
		this.itens = carrinho.itens;
		this.ultimoAdicionado = carrinho.ultimoAdicionado;

		this.valorTotal = this.calcularTotal();
		this.numeroItens = this.calcularNumeroItens();
		this.classe = this.atualizarClasse();
	};

	Carrinho.prototype.atualizar = function (numeroPedido, produto, cb) {
		var underscore = require('underscore');
		var quantidadeProduto = produto.quantidade;

		var produtoCarrinho = underscore.find(this.itens, function (item) {
			return item._id === produto._id.toString();
		});

		var produtoModel = produtoCarrinho ? produtoCarrinho : new app.models.produto();

		if (!produtoCarrinho) {
			produtoModel.preencher(produto, true);
			produtoModel.numeroPedido = produto.numeroPedido ? produto.numeroPedido : 0;
		}

		var totalPedido = produtoModel.numeroPedido + parseInt(numeroPedido);

		if (totalPedido > quantidadeProduto) {
			return cb(new app.models.erro('Infelizmente não temos mais ' + produto.nome + ' em estoque.', 'ERRO_NEGOCIO'), null);
		}

		produtoModel.numeroPedido = totalPedido;
		produtoModel.totalPedido = produtoModel.numeroPedido * produto.preco;

		if (!produtoCarrinho) {
			this.itens.push(produtoModel);
		}

		this.ultimoAdicionado = produtoModel;
		this.valorTotal = this.calcularTotal();
		this.numeroItens = this.calcularNumeroItens();
		this.classe = this.atualizarClasse();
		return cb(null, this);
	};

	Carrinho.prototype.removerItem = function (id, cb) {
		var underscore = require('underscore');
		var item = underscore.findWhere(this.itens, { _id: id });
		this.itens = underscore.without(this.itens, item);

		this.valorTotal = this.calcularTotal();
		this.numeroItens = this.calcularNumeroItens();
		this.classe = this.atualizarClasse();
		return cb(null, this);
	};

	return Carrinho;
};