module.exports = function (app) {
	var Compra = function () {
		this.valor = 0;
		this.valorFrete = 0;
		this.valorTotal = 0;
		this.modoPagamento = '';
		this.tipoFrete = '';
		this.comentario = '';
		this.produtos = [];
		this.cliente = undefined;
		this.data = new Date();
		this.textoData = app.models.util.dataToString(this.data);
		this.schema = app.schemas.compra;
		this.erro = app.models.erro;
		this.status = 'REGISTRADA';
	};

	Compra.prototype.preencher = function (compra, adicionarId) {
		if (adicionarId) {
			this._id = adicionarId;
		}

		this.modoPagamento = compra.modoPagamento;
		this.tipoFrete = compra.tipoFrete;
		this.comentario = compra.comentario;
	};

	Compra.prototype.gerarNumero = function () {
		return this.produtos.length.toString() + this.data.getHours().toString()
			+ this.data.getMinutes().toString() + this.data.getSeconds().toString()
			+ this.data.getMilliseconds().toString();
	};

	Compra.prototype.realizar = function (carrinho, cliente, cep, cb) {
		var obj = this;
		var underscore = require('underscore');
		var mensagensErro = [];
		var numeroProdutos = carrinho.itens.length;
		var produtosValidados = 0;

		var ids = underscore.map(carrinho.itens, function (item) {
			return item._id.toString();
		});

		app.schemas.produto.recuperarPorIds(ids, function (erro, produtos) {
			if (erro) {
				return cb(new obj.erro('Erro ao recuperar produtos', 'ERRO', erro));
			}
			else if (!produtos.length) {
				return cb(new obj.erro('Não existem produtos disponíveis', 'ERRO_NEGOCIO', erro));
			}

			for (var i = 0; i < produtos.length; i++) {
				var produto = produtos[i];

				var itemCarrinho = underscore.find(carrinho.itens, function (item) {
					return item._id.toString() === produto._id.toString();
				});

				produto.numeroPedido = itemCarrinho.numeroPedido;
				if (produto.numeroPedido > produto.quantidade) {
					mensagensErro.push('Infelizmente não temos mais ' + produto.nome + ' em estoque.');
				}
			};

			if (mensagensErro.length) {
				return cb(new obj.erro(null, 'ERRO_NEGOCIO', null, mensagensErro));
			}

			new app.models.cliente().calcularFrete(cep, carrinho, obj.tipoFrete, function (erro, dado) {
				obj.valor = carrinho.calcularTotal();
				obj.valorFrete = parseFloat(dado[0].Valor.replace(',', '.'));
				obj.valorTotal = obj.valor + obj.valorFrete;
				obj.produtos = carrinho.itens;
				obj.cliente = cliente ? cliente._id : undefined;
				obj.numero = obj.gerarNumero();

				var novo = obj.schema(obj);

				novo.save(obj, function (erro, compra) {
					if (erro) {
						return cb(new obj.erro('Erro ao inserir a compra', 'ERRO', erro));
					}

					return cb(null, compra);
				});
			});
		});
	};

	Compra.prototype.enviarEmails = function (modelCompra) {
		var opcoesEmailLoja = {
			destinatario: process.env.CONTATO_EMAIL,
			assunto: 'Compra ' + modelCompra.numero + ' finalizada',
			model: {
				compra: modelCompra,
				mensagem: 'Mais uma compra concluída! Acesse o sistema para verificar mais detalhes.'
			},
			nomeTemplate: 'nova-compra'
		};

		var opcoesEmailCliente = {
			destinatario: modelCompra.cliente.email,
			assunto: 'Compra ' + modelCompra.numero + ' concluída com sucesso',
			model: {
				compra: modelCompra,
				mensagem: 'Obrigado por nos escolher! Sua compra já foi realizada com sucesso!'
			},
			nomeTemplate: 'nova-compra'
		};

		app.models.util.enviarEmail(opcoesEmailLoja, function (erro) {
			if (erro) {
				console.log(erro);
				console.log('Erro ao enviar email para a loja sobre a compra' + modelCompra.numero);
			}
		});

		app.models.util.enviarEmail(opcoesEmailCliente, function (erro) {
			if (erro) {
				console.log(erro);
				console.log('Erro ao enviar email para o cliente sobre a compra' + modelCompra.numero);
			}
		});
	};

	Compra.prototype.finalizar = function (modelCompra) {
		modelCompra.status = 'FINALIZADA';
		var id = modelCompra._doc._id;
		delete modelCompra._doc._id;

		this.schema.update({ _id: id }, modelCompra._doc, function (erro, dado) {
			if (erro) {
				console.log(erro);
			}
			else {
				console.log('Compra atualizada');
			}
		});
	};

	Compra.prototype.atualizarDashboard = function () {
		var dashboard = new app.models.dashboard();
		dashboard.atualizarAposVenda(function (erro, data) {
			if (erro) {
				console.log(erro);
			}
			else {
				console.log('Dashboard atualizado!');
				console.log(data);
			}
		});
	};

	Compra.prototype.atualizarDadosProduto = function (produtos) {
		var underscore = require('underscore');
		var schema = app.schemas.produto;
		var produtosTotais = produtos.length;
		var protudosAtualizados = 0;
		var obj = this;

		for (var i = 0; i < produtos.length; i++) {
			var produto = produtos[i];
			var produtoModel = new app.models.produto();

			produtoModel.preencher(produto, true);
			produtoModel.totalVendido += produto.numeroPedido;
			produtoModel.quantidade -= produto.numeroPedido;

			produtoModel.inserirOuAtualizar(produto.categoria.nome, true, function (erro, data) {
				if (erro) {
					console.log(erro);
				};

				protudosAtualizados++;
			});
		}
	};

	return Compra;
};