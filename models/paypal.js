module.exports = function (app) {
	var Paypal = function () {
		this.mode = process.NODE_ENV === 'production' ? 'live' : 'sandbox';
		this.signature = process.env.PAYPAL_SIGNATURE;
		this.user = process.env.PAYPAL_USER;
		this.pwd = process.env.PAYPAL_PWD;
		this.baseUrl = process.env.NODE_ENV !== 'test' ? 'http://localhost:5000' : 'https://teste-ecommerce.herokuapp.com';
		this.version = '79';
		this.moeda = 'BRL';
	};

	Paypal.prototype.configurar = function () {
		this.sdk.configure({
			'mode': this.mode,
			'client_id': this.clienteId,
			'client_secret': this.clienteSecret
		});
	};

	Paypal.prototype.finalizarPagamento = function (opcoes, cb) {
		var obj = this;

		var dados = {
			user: obj.user,
			pwd: obj.pwd,
			signature: obj.signature,
			version: this.version,
			method: 'DoExpressCheckoutPayment',
			token: opcoes.token,
			PAYERID: opcoes.payerId,
			PAYMENTREQUEST_0_AMT: opcoes.valorTotal,
			PAYMENTREQUEST_0_CURRENCYCODE: this.moeda,
			PAYMENTREQUEST_0_PAYMENTACTION: 'Sale'
		};

		app.models.util.realizarRequisicao('api-3t.sandbox.paypal.com', '/nvp', 'GET', dados, false, function (erro, dado) {
			if (erro) {
				return cb(new obj.erro('Erro ao requisitar o paypal', 'ERRO', erro));
			}

			return cb(null, dado);
		});
	};

	Paypal.prototype.recuperarDadosCheckout = function (token, cb) {
		var obj = this;

		var dados = {
			user: obj.user,
			pwd: obj.pwd,
			signature: obj.signature,
			version: this.version,
			method: 'GetExpressCheckoutDetails',
			token: token
		};

		app.models.util.realizarRequisicao('api-3t.sandbox.paypal.com', '/nvp', 'GET', dados, false, function (erro, dado) {
			if (erro) {
				return cb(new obj.erro('Erro ao requisitar o paypal', 'ERRO', erro));
			}

			return cb(null, dado);
		});
	};

	Paypal.prototype.realizarExpressCheckout = function (compra, cb) {
		var obj = this;

		var dados = {
			user: obj.user,
			pwd: obj.pwd,
			signature: obj.signature,
			version: this.version,
			method: 'SetExpressCheckout',
			PAYMENTREQUEST_0_AMT: compra.valorTotal,
			PAYMENTREQUEST_0_PAYMENTACTION: 'SALE',
			PAYMENTREQUEST_0_CURRENCYCODE: this.moeda,
			returnUrl: obj.baseUrl + '/compra/resumo/' + compra._id.toString(),
			cancelUrl: obj.baseUrl + '/compra/finalizar?erro=true',
		};

		app.models.util.realizarRequisicao('api-3t.sandbox.paypal.com', '/nvp', 'GET', dados, false, function (erro, dado) {
			if (erro) {
				return cb(new obj.erro('Erro ao requisitar o paypal', 'ERRO', erro));
			}

			return cb(null, dado);
		});
	};

	return Paypal;
};