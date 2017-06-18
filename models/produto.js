module.exports = function (app) {
	var Produto = function () {
		this.nome = '';
		this.descricao = '';
		this.observacao = '';
		this.preco = undefined;
		this.ativo = true;
		this.peso = undefined;
		this.largura = undefined;
		this.altura = undefined;
		this.comprimento = undefined;
		this.urlFotoLista = '';
		this.urlFotoPainel = '';
		this.erro = app.models.erro;
		this.schema = app.schemas.produto;
		this.categoria = 0;
		this.quantidade = 1;
		this.destaque = false;
		this.totalVendido = 0;
	};

	Produto.prototype.preencher = function (produto, carregado) {
		if (carregado) {
			this._id = produto._id;
			this.ativo = produto.ativo;
			this.destaque = produto.destaque;
			this.totalVendido = produto.totalVendido;
		}

		this.nome = produto.nome;
		this.descricao = produto.descricao;
		this.observacao = produto.observacao;
		this.preco = produto.preco;
		this.peso = produto.peso;
		this.largura = produto.largura;
		this.altura = produto.altura;
		this.comprimento = produto.comprimento;
		this.urlFotoLista = produto.urlFotoLista;
		this.urlFotoPainel = produto.urlFotoPainel;
		this.categoria = produto.categoria;
		this.quantidade = produto.quantidade;
	};

	Produto.prototype.inserirOuAtualizar = function (nomeCategoria, isEdicao, cb) {
		var obj = this;
		obj.ativo = obj.quantidade >= 1 ? true : false;
		console.log(obj.preco);

		var categoria = new app.models.categoria();

		categoria.inserir(nomeCategoria, function (erro, data) {
			if (erro) {
				return cb(new obj.erro('Erro ao inserir uma categoria', 'ERRO', erro));
			}

			obj.categoria = data._id;

			if (isEdicao) {
				var id = obj._id;
				delete obj._id;

				obj.schema.update({ _id: id }, obj, function (erro, data) {
					if (erro) {
						return cb(new obj.erro('Erro ao atualizar um produto', 'ERRO', erro));
					}

					obj.atualizarDashboard();
					return cb(null, data);
				});
			}
			else {
				var novo = obj.schema(obj);
				novo.save(obj, function (erro, data) {
					if (erro) {
						return cb(new obj.erro('Erro ao inserir um produto', 'ERRO', erro));
					}

					obj.atualizarDashboard();
					return cb(null, data);
				});
			}
		});
	};

	Produto.prototype.ativarOuInativar = function (status, cb) {
		var obj = this;
		obj.ativo = app.models.util.stringToBool(status);
		obj.quantidade = obj.ativo ? 1 : 0;

		if (!obj.ativo) {
			obj.destaque = false;
		}

		var id = obj._id;
		delete obj._id;

		obj.schema.update({ _id: id }, obj, function (erro, data) {
			if (erro) {
				return cb(new obj.erro('Erro ao inativar um produto', 'ERRO', erro));
			}

			obj.atualizarDashboard();
			return cb(null, data);
		});
	};

	Produto.prototype.destacarOuNao = function (status, cb) {
		var obj = this;
		obj.destaque = app.models.util.stringToBool(status);
		if (obj.destaque && !obj.ativo) {
			obj.ativo = true;
			obj.quantidade = 1;
		}

		var id = obj._id;
		delete obj._id;

		obj.schema.update({ _id: id }, obj, function (erro, data) {
			if (erro) {
				return cb(new obj.erro('Erro ao destacar um produto', 'ERRO', erro));
			}

			return cb(null, data);
		});
	};

	Produto.prototype.atualizarDashboard = function () {
		var dashboard = new app.models.dashboard();
		dashboard.atualizarAposCadastroProduto(function (erro, data) {
			if (erro) {
				console.log(erro);
			}
			else {
				dashboard.atualizarAposVenda(function (erro, data) {
					if (erro) {
						console.log(erro);
					}
					else {
						console.log('Dashboard atualizado!');
						console.log(data);
					}
				});
			}
		});
	};

	Produto.prototype.recuperarDadosListagem = function (maximo, pagina, ordenacao, menorPreco, maiorPreco, categoria, busca, cb) {
		var obj = this;

		var objRetorno = {
			total: 0,
			produtos: []
		};

		obj.schema.contarTotalAtivos(categoria, function (erro, total) {
			if (erro) {
				return cb(erro, null);
			}

			obj.schema.recuperarAtivos(maximo, pagina, ordenacao, menorPreco, maiorPreco, categoria, busca, function (erro, data) {
				if (erro) {
					return cb(erro, null);
				}

				objRetorno.total = total;
				objRetorno.produtos = data;

				return cb(null, objRetorno);
			});
		});
	};

	return Produto;
};