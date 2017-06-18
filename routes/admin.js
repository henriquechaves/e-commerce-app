module.exports = function (app) {
	var usuario = app.controllers.usuario;
	var produto = app.controllers.produto;
	var compra = app.controllers.compra;
	var comum = app.controllers.comum;
	var autenticador = require('../comum/autenticador');

	//Usuário
	app.get('/admin/login', usuario.login);

	app.get('/admin', autenticador, usuario.dashboard);
	app.get('/admin/usuario/dadosUsuario', autenticador, usuario.buscarDadosUsuarioLogado);
	app.get('/admin/usuarios', autenticador, usuario.index);
	app.get('/admin/usuario/excluir/:id', autenticador, usuario.excluir);
	app.get('/admin/usuario/sair', autenticador, usuario.sair);

	app.post('/admin/login', usuario.logar);
	app.post('/admin/usuario/novo', autenticador, usuario.cadastrar);

	//Produto
	app.get('/admin/produtos', autenticador, produto.index);
	app.get('/admin/produto/index', autenticador, produto.index);
	app.get('/admin/produto/novo', autenticador, produto.novo);
	app.get('/admin/produto/ativarOuInativar/:id/:status', autenticador, produto.ativarOuInativar);
	app.get('/admin/produto/destacarOuNao/:id/:status', autenticador, produto.destacarOuNao);
	app.get('/admin/produto/editar/:id', autenticador, produto.edicao);

	app.post('/admin/produto/cadastro', produto.cadastro);

	//Comum
	app.post('/admin/upload/:l/:c', autenticador, comum.upload);

	//Compra
	app.get('/admin/compras', autenticador, compra.index);
	app.get('/admin/compra/index', autenticador, compra.index);

	app.get('/admin/compra/ver', autenticador, compra.ver);
};