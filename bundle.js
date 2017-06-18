module.exports = function (app) {
	var piler = require('piler');
	var clientjs = piler.createJSManager();
	var clientcss = piler.createCSSManager();
	var srv = require('http').createServer(app);

	clientjs.bind(app, srv);
	clientcss.bind(app, srv);

	var caminhoBase = __dirname + '/public';
	var nomeAdmin = 'admin';
	var nomeSite = 'site';
	var contato = 'contato';
	var finalizarCompra = 'finalizar-compra';
	var indexSite = 'index-site';
	var listaProdutosSite = 'lista-produtos-site';
	var verCarrinho = 'ver-carrinho';
	var verProduto = 'ver-produto';
	var cadastroProduto = 'cadastro-produto';
	var cadatroUsuario = 'cadastro-usuario';

	//Comum ao admin
	clientjs.addFile(nomeAdmin, caminhoBase + '/javascripts/jQuery/jquery.js');
	clientjs.addFile(nomeAdmin, caminhoBase + '/javascripts/bootstrap-lib/bootstrap.min.js');
	clientjs.addFile(nomeAdmin, caminhoBase + '/javascripts/jQuery/toastr.js');
	clientjs.addFile(nomeAdmin, caminhoBase + '/javascripts/jQuery/jquery.serializejson.min.js');
	clientjs.addFile(nomeAdmin, caminhoBase + '/javascripts/jQuery/jquery.tmpl.min.js');
	clientjs.addFile(nomeAdmin, caminhoBase + '/javascripts/numeral/numeral.min.js');
	clientjs.addFile(nomeAdmin, caminhoBase + '/javascripts/numeral/languages.min.js');
	clientjs.addFile(nomeAdmin, caminhoBase + '/javascripts/comum/main.js');

	clientcss.addFile(nomeAdmin, caminhoBase + '/stylesheets/jQuery/toastr.css');
	clientcss.addFile(nomeAdmin, caminhoBase + '/stylesheets/style.css');

	//Comum ao site
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/metronic-jquery.min.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/jquery-migrate.min.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/jquery-ui.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/bootstrap-lib/bootstrap.min.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/back-to-top.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/jquery.slimscroll.min.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/jquery.fancybox.pack.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/owl.carousel.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/jquery.zoom.min.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/bootstrap.touchspin.min.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/greensock.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/layerslider.transitions.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/layerslider.kreaturamedia.jquery.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/layerslider-init.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/jquery.uniform.min.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/jquery.rateit.min.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/toastr.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/jQuery/layout.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/numeral/numeral.min.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/numeral/languages.min.js');
	clientjs.addFile(nomeSite, caminhoBase + '/javascripts/comum/comum-metronic.js');

	//Pagina de contato
	clientjs.addFile(contato, caminhoBase + '/javascripts/jQuery/jquery.uniform.min.js');
	clientjs.addFile(contato, caminhoBase + '/javascripts/maps/gmaps.min.js');
	clientjs.addFile(contato, caminhoBase + '/javascripts/contato/contato.js');

	//Página de finalização de compra
	clientjs.addFile(finalizarCompra, caminhoBase + '/javascripts/jQuery/jquery.mask.min.js');
	clientjs.addFile(finalizarCompra, caminhoBase + '/javascripts/jQuery/spin.min.js');
	clientjs.addFile(finalizarCompra, caminhoBase + '/javascripts/jQuery/ladda.min.js');
	clientjs.addFile(finalizarCompra, caminhoBase + '/javascripts/jQuery/jquery.serializejson.min.js');
	clientjs.addFile(finalizarCompra, caminhoBase + '/javascripts/site/finalizar-compra.js');
	clientjs.addFile(finalizarCompra, caminhoBase + '/javascripts/paypal/checkout.js');

	//Index do site
	clientjs.addFile(indexSite, caminhoBase + '/javascripts/jQuery/jquery.tmpl.min.js');
	clientjs.addFile(indexSite, caminhoBase + '/javascripts/site/main.js');

	//Lista de produtos do site
	clientjs.addFile(listaProdutosSite, caminhoBase + '/javascripts/jQuery/jquery.mask.min.js');
	clientjs.addFile(listaProdutosSite, caminhoBase + '/javascripts/jQuery/jquery.tmpl.min.js');
	clientjs.addFile(listaProdutosSite, caminhoBase + '/javascripts/site/main.js');
	clientjs.addFile(listaProdutosSite, caminhoBase + '/javascripts/site/lista-produtos.js');

	//Página de ver carrinho		
	clientjs.addFile(verCarrinho, caminhoBase + '/javascripts/site/main.js');
	clientjs.addFile(verCarrinho, caminhoBase + '/javascripts/site/ver-carrinho.js');
	clientjs.addFile(verCarrinho, caminhoBase + '/javascripts/jQuery/jquery.tmpl.min.js');

	//Pagina de ver produto
	clientjs.addFile(verProduto, caminhoBase + '/javascripts/jQuery/jquery.tmpl.min.js');
	clientjs.addFile(verProduto, caminhoBase + '/javascripts/jQuery/jquery.mask.min.js');
	clientjs.addFile(verProduto, caminhoBase + '/javascripts/site/main.js');
	clientjs.addFile(verProduto, caminhoBase + '/javascripts/site/ver-produto.js');

	//Página de cadastro de produto
	clientjs.addFile(cadastroProduto, caminhoBase + '/javascripts/jQuery/bootstrap-filestyle.min.js');
	clientjs.addFile(cadastroProduto, caminhoBase + '/javascripts/jQuery/jquery.mask.min.js');
	clientjs.addFile(cadastroProduto, caminhoBase + '/javascripts/jQuery/select2.min.js');
	clientjs.addFile(cadastroProduto, caminhoBase + '/javascripts/jQuery/i18n/pt-BR.js');
	clientjs.addFile(cadastroProduto, caminhoBase + '/javascripts/comum/comum-select2.js');
	clientjs.addFile(cadastroProduto, caminhoBase + '/javascripts/comum/upload.js');
	clientjs.addFile(cadastroProduto, caminhoBase + '/javascripts/cadastro/produto.js');

	clientcss.addFile(cadastroProduto, caminhoBase + '/stylesheets/jQuery/select2.min.css');

	//Pagina de cadastro de usuario	
	clientjs.addFile(cadatroUsuario, caminhoBase + '/javascripts/cadastro/usuario.js');

	app.locals.bundleJsAdmin = clientjs.renderTags(nomeAdmin);
	app.locals.bundleCssAdmin = clientcss.renderTags(nomeAdmin);

	app.locals.bundleJsSite = clientjs.renderTags(nomeSite);
	app.locals.bundleCssSite = clientcss.renderTags(nomeSite);

	app.locals.bundleJsContato = clientjs.renderTags(contato);
	app.locals.bundleCssContato = clientcss.renderTags(contato);

	app.locals.bundleJsFinalizarCompra = clientjs.renderTags(finalizarCompra);
	app.locals.bundleCssFinalizarCompra = clientcss.renderTags(finalizarCompra);

	app.locals.bundleJsIndexSite = clientjs.renderTags(indexSite);
	app.locals.bundleCssIndexSite = clientcss.renderTags(indexSite);

	app.locals.bundleJsListaProdutosSite = clientjs.renderTags(listaProdutosSite);
	app.locals.bundleCssListaProdutosSite = clientcss.renderTags(listaProdutosSite);

	app.locals.bundleJsVerCarrinho = clientjs.renderTags(verCarrinho);
	app.locals.bundleCssVerCarrinho = clientcss.renderTags(verCarrinho);

	app.locals.bundleJsVerProduto = clientjs.renderTags(verProduto);
	app.locals.bundleCssVerProduto = clientcss.renderTags(verProduto);

	app.locals.bundleJsCadastroProduto = clientjs.renderTags(cadastroProduto);
	app.locals.bundleCssCadastroProduto = clientcss.renderTags(cadastroProduto);

	app.locals.bundleJsCadastroUsuario = clientjs.renderTags(cadatroUsuario);
	app.locals.bundleCssCadastroUsuario = clientcss.renderTags(cadatroUsuario);

	srv.listen(8080);
};