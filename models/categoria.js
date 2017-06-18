module.exports = function (app) {
	var Categoria = function () {
		this.nome = '';
		this.schema = app.schemas.categoria;
		this.erro = app.models.erro;
	};

	Categoria.prototype.preencher = function (categoria, adicionarId) {
		if (adicionarId) {
			this._id = categoria._id;
		}

		this.nome = categoria.nome;
	};

	Categoria.prototype.inserir = function (nome, cb) {
		var obj = this;

		obj.schema.recuperar({ nome: nome }, function (erro, data) {
			if (erro) {
				return cb(new obj.erro('Erro ao recuperar a categoria', 'ERRO', erro));
			}
			else if (data) {
				return cb(null, data);
			}
			else {
				var novaCategoria = new Categoria();
				novaCategoria.preencher({ nome: nome }, false);

				var nova = obj.schema(novaCategoria);

				nova.save(novaCategoria, function (erro, data) {
					if (erro) {
						return cb(new obj.erro('Erro ao inserir uma categoria', 'ERRO', erro));
					}
					else {
						return cb(null, data);
					}
				});
			}
		});
	};

	return Categoria;
};