module.exports = function (app) {
	var cliente = app.controllers.cliente;

	app.post('/cliente/login', cliente.login);
	app.post('/cliente/confirmarPedido', cliente.confirmarPedido);

	app.get('/cliente/buscarCep/:cep/:calcularFrete', cliente.buscarCep);

	app.post('/cliente/recuperarSenha', cliente.recuperarSenha);
};