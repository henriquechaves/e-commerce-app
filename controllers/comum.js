module.exports = function (app) {
	var ComumController = {
		upload: function (req, res) {
			app.models.util.upload(req, function (erro, data) {

				if (erro) {
					var retorno = new app.models.retornoRequisicao(erro, null);
					return retorno.retornarJson(res);
				}

				var retorno = new app.models.retornoRequisicao(null, { url: data });
				return retorno.retornarJson(res);
			});
		}
	};

	return ComumController;
};