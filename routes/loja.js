module.exports = function (app) {
	var loja = app.controllers.loja;

	app.get('/', loja.index);
	app.get('/index', loja.index);
	app.get('/produtos', loja.produtos);
	app.get('/produtos?cat=:cat&pag=pag', loja.produtos);
	app.get('/produto/ver/:id', loja.verProduto);

	app.get('/sobre', loja.sobre);
	app.get('/contato', loja.contato);
	app.post('/enviar', loja.enviarEmail);

	app.get('/devolucao', loja.devolucao);
	app.get('/pagamento', loja.pagamento);
	app.get('/frete', loja.frete);
	app.get('/entrega', loja.entrega);

	app.get('/carrinho/recuperar', loja.recuperarCarrinho);
	app.get('/carrinho/remover/:idProduto', loja.removerDoCarrinho);
	app.get('/carrinho/ver', loja.verCarrinho);

	app.post('/carrinho/adicionar', loja.adicionarAoCarrinho);

	app.get('/compra/finalizar', loja.finalizarCompra);
	app.get('/compra/resumo/:idCompra', loja.resumo);
};