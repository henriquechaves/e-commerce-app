module.exports = function (app) {
	var CompraController = {
		index: function (req, res) {
			var compras = undefined;

			app.schemas.compra.recuperarTodasFinalizadas(function (erro, data) {
				if (erro) {
					compras = [];
				}

				compras = data;
				res.render('compra/index.ejs', { compras: compras });
			});
		},
		ver: function (req, res) {
			var url = require('url');
			var partes = url.parse(req.url, true);
			var query = partes.query;

			if (!query.numero) {
				return res.redirect('/admin/compras');
			}

			var compra = undefined;
			app.schemas.compra.recuperar({ numero: query.numero }, function (erro, data) {
				if (erro) {
					compra = new app.models.compra();
				}
				else {
					compra = data;
				}

				var model = {
					compra: compra,
				};

				res.render('compra/ver.ejs', model);
			});
		}
	};

	return CompraController;
};