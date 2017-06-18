module.exports = function(app) {
	var Usuario = function(){		
		this.nome = '';
		this.email = '';
		this.senha = '';
		this.dataCriacao = new Date().getTime().toString();
		this.schema = app.schemas.usuario;
		this.erro = app.models.erro;
	};

	Usuario.prototype.preencher = function(usuario, adicionarId) {
		if(adicionarId){
			this._id = usuario._id;
		}

		this.nome = usuario.nome;
		this.email = usuario.email;
		this.senha = usuario.senha;
	};

	Usuario.prototype.inserir = function(cb){
		var obj = this;
		obj.senha = app.models.util.criptografar(obj.dataCriacao, obj.senha);

		obj.schema.recuperar({email: obj.email}, function(erro, usuario){
			if(erro){
				return cb(new obj.erro('Erro ao recuperar o usuário', 'ERRO', erro));
			}
			else if(usuario){
				return cb(new obj.erro('Já existe um usuário com esse email, não posso cadastrá-lo', 'ERRO_NEGOCIO'));
			}

			var novo = obj.schema(obj);

			novo.save(obj, function(erro, usuario){
				if(erro){
					return cb(new obj.erro('Erro ao inserir o usuário', 'ERRO', erro));
				}

				return cb(null, usuario);
			});
		});
	};

	Usuario.prototype.excluir = function(id, cb){
		var obj = this;

		obj.schema.excluir(id, function(erro, data){
			if(erro){
				return cb(new obj.erro('Erro ao excluir o usuário', 'ERRO', erro));
			}

			cb(null, data);
		});
	};

	Usuario.prototype.autenticar = function(cb) {
		var obj = this;

		obj.schema.recuperar({email:obj.email}, function(erro, usuario){
			if(erro){
				return cb(new obj.erro('Erro ao recuperar usuário', 'ERRO', erro), false);
			}
			else if(!usuario){
				return cb(new obj.erro('Usuário não encontrado', 'ERRO_NEGOCIO'), false);
			}
			else if(app.models.util.descriptografar(usuario.dataCriacao, usuario.senha) !== obj.senha){
				return cb(new obj.erro('Senha inválida', 'ERRO_NEGOCIO'), false);
			}

			obj.preencher(usuario, false);
			return cb(null, obj);
		})
	};

	return Usuario;
};