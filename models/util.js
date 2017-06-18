module.exports = function(app) {
	var Util = function () {
		this.crypto = require('crypto');
		this.algoritmo = 'aes-256-ctr';
		this.chaveDefault = 'edd0bf76-bc97-45a2-b5c9-3507364064f1';

		this.criptografar = function(chave, texto){
			var c = chave !== undefined ? chave : this.chaveDefault;

			var cipher = this.crypto.createCipher(this.algoritmo, c);
			var crypted = cipher.update(texto.toString(),'utf8','hex')

			crypted += cipher.final('hex');
			
			return crypted;
		};

		this.descriptografar = function(chave, texto){
			var c = chave !== undefined ? chave : this.chaveDefault;

			var decipher = this.crypto.createDecipher(this.algoritmo, c)
			var dec = decipher.update(texto.toString(),'hex','utf8')
			
			dec += decipher.final('utf8');

			return dec;
		};

		this.dataToString = function(data){			
			var dataFormatada = data.getDay().toString() + '/' + (data.getMonth() + 1).toString() + '/' + data.getFullYear().toString();
			var horaFormatada = data.getHours().toString() + ':' + data.getMinutes().toString();

			var result = dataFormatada +  ' às ' + horaFormatada;
			return result;
		};

		this.upload = function(req, cb){
			var u = this;
			var fs = require('fs');
			var cloudinary = require('cloudinary')
			var cloudinaryUrl = process.env.CLOUDINARY_URL;

			var fstream;
			req.pipe(req.busboy);
			
			req.busboy.on('file', function (fieldname, file, filename) {
				var caminho = '/uploads/' + new Date().getTime();
				var caminhoCompleto = 'public' + caminho;
				fstream = fs.createWriteStream('public' + caminho);
				file.pipe(fstream);

				fstream.on('close', function () {										
					if(cloudinaryUrl !== undefined){				
						var cloudinary = require('cloudinary');						
						
						cloudinary.config({ 
							cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
							api_key: process.env.CLOUDINARY_API_KEY, 
							api_secret: process.env.CLOUDINARY_SECRET_KEY
						});
						
						var obj = {
							width: req.params.l,												
							secure:true, 
						};

						if(u.stringToBool(req.params.c)){
							obj['height'] = obj.width;
							obj['crop'] = 'fit';
						}						
						
						var stream = cloudinary.uploader.upload(caminhoCompleto, function(result) {							
							fs.unlink(caminhoCompleto, function (erro) {
								if(erro){
									return cb(new app.models.erro('Erro ao fazer upload do arquivo', 'ERRO', erro));
								}
							});

							var urlCropada = cloudinary.url(result.public_id, obj);
							return cb(null, urlCropada);
						});							
					}
					else{
						return cb(null, caminho);
					}
				});						
			});	
};

this.stringToBool = function(str){
	return str === 'true';
};

this.gerarNovaSenha = function(){
	var novaSenha = '';
	for (var i = 0; i < 6; i++) {
		var numero = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
		novaSenha += numero.toString();
	}

	return novaSenha;
};

this.compilarTemplate= function (nomeTemplate, model, cb) {
	if(!nomeTemplate){
		return cb(false, null);
	}

	var EmailTemplate = require('email-templates').EmailTemplate;
	var path = require('path');
	var diretorio = path.join(__dirname, 'templates', nomeTemplate);
	var template = new EmailTemplate(diretorio);
	
	template.render(model, function (erro, result) {
		if(erro){
			return cb(erro, null);
		}
		else{
			return cb(null, result);
		}
	});

}

this.enviarEmail = function(opcoes, cb){	
	var assunto = opcoes.assunto ? opcoes.assunto : 'Mensagem de ' + opcoes.nome + '(' + opcoes.email + ')';
	var corpo = opcoes.mensagem;
	var html = '';
	var nomeTemplate = null;

	if(corpo){
		html = corpo;
	}
	else{
		nomeTemplate = opcoes.nomeTemplate;
	}

	this.compilarTemplate(nomeTemplate, opcoes.model, function(erro, result){
		if(erro){
			console.log('Erro ao compilar template', erro);
			return cb(erro, null);
		}

		if(result){
			html = result.html;
		}

		var data = {
			from: process.env.CONTATO_EMAIL,
			to: opcoes.destinatario,
			subject: assunto,		
			html: html
		};

		if(process.env.CONTATO_EMAIL){		
			var nodemailer = require('nodemailer');
			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: process.env.CONTATO_EMAIL,
					pass: process.env.CONTATO_SENHA
				}
			});

			transporter.sendMail(data, function(erro, data){		
				return cb(erro);
			});
		}
		else{
			var api_key = process.env.MAILGUN_KEY;
			var domain = process.env.EMAIL_DOMAIN;
			var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

			mailgun.messages().send(data, function(erro, info) {
				return cb(erro);
			});
		}
	});	
};

this.chunk = function(n, data){
	var underscore = require('underscore');

	var listas = underscore.chain(data).groupBy(function(elemento, indice){
		return Math.floor(indice / n);
	}).toArray().value();

	return listas;
};

this.recuperarEstados = function(){
	var estados = [];						

	estados.push({id: 'AC', nome: 'Acre'});
	estados.push({id: 'AL', nome: 'Alagoas'});
	estados.push({id: 'AP', nome: 'Amapá'});
	estados.push({id: 'AM', nome: 'Amazonas'});
	estados.push({id: 'BA', nome: 'Bahia'});
	estados.push({id: 'CE', nome: 'Ceará'});
	estados.push({id: 'DF', nome: 'Distrito Federal'});
	estados.push({id: 'ES', nome: 'Espírito Santo'});
	estados.push({id: 'GO', nome: 'Goiás'});
	estados.push({id: 'MA', nome: 'Maranhão'});
	estados.push({id: 'MT', nome: 'Mato Grosso'});
	estados.push({id: 'MS', nome: 'Mato Grosso do Sul'});
	estados.push({id: 'MG', nome: 'Minas Gerais'});
	estados.push({id: 'PA', nome: 'Pará'});
	estados.push({id: 'PB', nome: 'Paraíba'});
	estados.push({id: 'PR', nome: 'Paraná'});
	estados.push({id: 'PE', nome: 'Pernanmbuco'});
	estados.push({id: 'PI', nome: 'Piauí'});
	estados.push({id: 'RJ', nome: 'Rio de Janeiro'});
	estados.push({id: 'RN', nome: 'Rio Grande do Norte'});
	estados.push({id: 'RS', nome: 'Rio Grande do Sul'});
	estados.push({id: 'RO', nome: 'Rondônia'});
	estados.push({id: 'RR', nome: 'Roraima'});
	estados.push({id: 'SC', nome: 'Santa Catarina'});
	estados.push({id: 'SP', nome: 'São Paulo'});
	estados.push({id: 'SE', nome: 'Sergipe'});
	estados.push({id: 'TO', nome: 'Tocantins'});			

	return estados;
};

this.realizarRequisicao = function(host, url, metodo, dado, isJson, cb) {
	var querystring = require('querystring');
	var https = require('https');

	if(isJson){
		var requisicao = JSON.stringify(dado);
	}
	else{
		var requisicao = querystring.stringify(dado);	
	}
	var cabecalho = {};

	if (metodo === 'GET') {
		url += '?' + querystring.stringify(dado);
	}
	else {			
		cabecalho = {
			'Content-Type': isJson ? 'application/json' : 'application/x-www-form-urlencoded',
			'Content-Length': requisicao.length
		};
	}

	var opcoes = {
		host: host,
		path: url,
		method: metodo,
		headers: cabecalho
	};

	var req = https.request(opcoes, function(res) {
		res.setEncoding('utf-8');

		var respostaString = '';

		res.on('data', function(data) {			
			respostaString += data;
		});	

		res.on('error', function(data) {
			console.log('Deu erro');
			console.log(data);
		});		

		res.on('end', function(erro) {			
			if(erro || res.statusCode !== 200){
				var log = erro ? erro : respostaString;
				console.log(log)
				return cb(respostaString, null);
			}

			if(isJson){
				return cb(null, JSON.parse(respostaString));
			}
			else{
				return cb(null, querystring.parse(respostaString));
			}
		});
	});

	req.write(requisicao);
	req.end();
};		
};

return new Util();
};