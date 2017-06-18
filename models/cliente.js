module.exports = function (app) {
	var Endereco = function () {
		this.rua = '';
		this.numero = 0;
		this.complemento = '';
		this.estado = '';
		this.cidade = '';
		this.cep = '';
	};

	var Cliente = function () {
		this.nome = '';
		this.sobrenome = '';
		this.email = '';
		this.telefone = '';
		this.dataCriacao = new Date().getTime().toString();
		this.senha = '';
		this.endereco = {};
		this.enderecoEntrega = {};
		this.schema = app.schemas.cliente;
		this.erro = app.models.erro;
	};

	Cliente.prototype.preencher = function (cliente, adicionarId) {
		if (adicionarId) {
			this._id = cliente._id;
		}

		this.nome = cliente.nome;
		this.sobrenome = cliente.sobrenome;
		this.email = cliente.email;
		this.senha = cliente.senha;
		this.telefone = cliente.telefone;
		this.endereco = cliente.endereco;
		this.enderecoEntrega = cliente.enderecoEntrega;
	};

	Cliente.prototype.buscarCep = function (cep, cb) {
		var obj = this;

		app.models.util.realizarRequisicao('viacep.com.br', '/ws/' + cep + '/json/unicode',
			'GET', {}, true, function (erro, dado) {
				if (erro) {
					return cb(new obj.erro('Erro ao recuperar o cep', 'ERRO', erro));
				}

				if (dado.erro) {
					return cb(new obj.erro('Cep inexistente', 'ERRO_NEGOCIO', erro));
				}

				return cb(null, dado);
			});
	};

	Cliente.prototype.recuperarCodigoServico = function (servico) {
		if (servico === 'PAC') return '41106';
		else if (servico === 'SEDEX') return '40010';
		else return '40215'
	};

	Cliente.prototype.calcularFrete = function (cep, carrinho, servico, cb) {
		var s = servico ? this.recuperarCodigoServico(servico) : '41106,40010,40215';
		var dados = {
			nCdServico: s,
			sCepOrigem: '30160011',
			sCepDestino: cep,
			nVlPeso: carrinho.calcularPeso(),
			nCdFormato: 1,
			nVlComprimento: 20,
			nVlAltura: 20,
			nVlLargura: 20,
			nVlDiametro: 20,
			sCdMaoPropria: 'S',
			nVlValorDeclarado: 0,
			sCdAvisoRecebimento: 'N'
		};

		console.log('Peso = ' + dados.nVlPeso);
		var Correios = require('node-correios'),
			correios = new Correios();

		correios.calcPreco(dados, function (dado) {
			if (dado.erro) {
				return cb(new obj.erro(dado.msgErro, 'ERRO_NEGOCIO', erro));
			}

			return cb(null, dado);
		});
	};

	Cliente.prototype.autenticar = function (cb) {
		var obj = this;

		obj.schema.recuperar({ email: obj.email }, function (erro, usuario) {
			if (erro) {
				return cb(new obj.erro('Erro ao recuperar cliente', 'ERRO', erro), false);
			}
			else if (!usuario) {
				return cb(new obj.erro('Cliente não encontrado', 'ERRO_NEGOCIO'), false);
			}
			else if (app.models.util.descriptografar(usuario.dataCriacao, usuario.senha) !== obj.senha) {
				return cb(new obj.erro('Senha inválida', 'ERRO_NEGOCIO'), false);
			}

			obj.preencher(usuario, false);
			return cb(null, obj);
		})
	};

	Cliente.prototype.criar = function (criarCliente, email, cb) {
		var obj = this;

		if (criarCliente === undefined) {
			obj.schema.recuperar({ email: email }, function (erro, cliente) {
				if (erro) {
					return cb(new obj.erro('Erro ao recuperar cliente', 'ERRO', erro), false);
				}
				else if (!cliente) {
					return cb(new obj.erro('Cliente não encontrado', 'ERRO_NEGOCIO'), false);
				}

				return cb(null, cliente);
			});
		}
		else if (criarCliente === false) {
			return cb(null, null);
		}

		obj.senha = app.models.util.criptografar(obj.dataCriacao, obj.senha);
		obj.schema.recuperar({ email: obj.email }, function (erro, cliente) {
			if (erro) {
				return cb(new obj.erro('Erro ao recuperar o usuário', 'ERRO', erro));
			}
			else if (cliente) {
				return cb(new obj.erro('Já existe um usuário com esse email, não posso cadastrá-lo', 'ERRO_NEGOCIO'));
			}

			var novo = obj.schema(obj);

			novo.save(obj, function (erro, cliente) {
				if (erro) {
					return cb(new obj.erro('Erro ao inserir o cliente', 'ERRO', erro));
				}

				return cb(null, cliente);
			});
		});
	};

	Cliente.prototype.gerarNovaSenha = function (cb) {
		var novaSenha = app.models.util.gerarNovaSenha();
		var obj = this;
		obj.senha = app.models.util.criptografar(obj.dataCriacao, novaSenha);
		var id = obj._id;
		delete obj._id;

		obj.schema.update({ _id: id }, obj, function (erro, data) {
			if (erro) {
				return cb(new obj.erro('Erro ao gerar nova senha', 'ERRO', erro));
			}

			var opcoes = {
				nomeTemplate: 'nova-senha',
				destinatario: obj.email,
				assunto: 'Nova senha',
				model: {
					login: obj.email,
					senha: novaSenha
				}
			};

			app.models.util.enviarEmail(opcoes, function (erro, data) {
				if (erro) {
					return cb(new obj.erro('Erro ao enviar email', 'ERRO', erro));
				}

				return cb(null);
			});
		});
	};

	return Cliente;
};