var Trolley = function(){

	var configuration = {
		cookieName : 'trolley',
		days : 1
	};

	var utils = {
		//http://www.quirksmode.org/js/cookies.html
		cookie : {
			create : function(name,value,days) {
				if (days) {
					var date = new Date();
					date.setTime(date.getTime()+(days*24*60*60*1000));
					var expires = '; expires='+date.toGMTString();
				}
				else var expires = '';
				document.cookie = name+'='+value+expires+'; path=/';
			},

			read : function(name) {
				var nameEQ = name + '=';
				var ca = document.cookie.split(';');

				for(var i=0;i < ca.length;i++) {
					var c = ca[i];
					while (c.charAt(0)==' ') {
						c = c.substring(1, c.length);
					};

					if (c.indexOf(nameEQ) == 0){
						return c.substring(nameEQ.length, c.length)
					};
				};
				return null;
			},

			erase : function(name) {
				this.create(name, '', -1);
			}
		}
	};

	var Product = function(name, price, quantity){

		if(!quantity){
			quantity = 1;
		};

		if( name === undefined || name === '' ){
			throw new Error('Name is empty');
		};

		if( isNaN( parseFloat(price) ) ){
			throw new Error('Price is not a valid number');
		};

		if( isNaN( parseInt(quantity) ) ){
			throw new Error('Quantity is not a valid number');
		};

		var $this = {};
		$this.name = name;
		$this.price = parseFloat(price);
		$this.quantity = ko.observable(quantity);
		$this.totalPrice = function(){
			return ($this.price * $this.quantity()).toFixed(2);
		};	

		$this.quantity.subscribe(function(v){
			if(v == 0){
				viewModel.removeProduct($this, true);
			};

			data.cookie.put(viewModel.products());
		});
		
		$this.type = function(){
			return 'Product'
		};

		return $this;
	};

	var data = {
		cookie : {

			get : function(){
				var cookie = utils.cookie.read(configuration.cookieName);

				if(cookie){
					var obj = null;
					try{
						var obj = JSON.parse(cookie);
					}
					catch(err){};

					if(obj){
						var products = [];
						for (var i = 0; i < obj.length; i++) {
							products.push(
								Product(obj[i].name, 
								obj[i].price,
								obj[i].quantity)
							);
						};

						return products;
					};
				};

				return [];
			},

			put : function(data){
				utils.cookie.create(
					configuration.cookieName, 
					ko.toJSON(data), 
					configuration.days	
				);
			}	

		}
	};
	
	var viewModel = {
		products : (function(){
			var k = ko.observableArray(data.cookie.get());

			k.quantity = function(){
				var total = 0;
				ko.utils.arrayForEach(k(), function(v){
					total += parseInt(v.quantity());
				});

				return total;
			};

			k.price = function(){
				var total = 0;
				ko.utils.arrayForEach(k(), function(v){
					total += parseFloat(v.totalPrice());
				});

				return total.toFixed(2);
			};

			k.subscribe(function(v){
				data.cookie.put(k);
			});

			return k;
		})(),

		getProduct : function(name){
			var products = viewModel.products();
			for (var i = 0; i < products.length; i++) {
				if(products[i].name == name){
					return products[i];
				};
			};

			return null;
		},

		addProduct : function(){
			var product;

			if(arguments[0].type && arguments[0].type() == 'Product'){
				product = arguments[0];
			}
			else
			{
				product = Product(arguments[0], arguments[1]);	
			};

			var p = viewModel.getProduct(product.name);

			if(p){
				p.quantity(parseFloat(p.quantity()) + 1);
			}
			else{
				viewModel.products.push(product);	
			};
		},

		removeProduct : function(product, all){
			var p = viewModel.getProduct(product.name);	
			if(all){
				viewModel.products.remove(p);	
			}else{
				p.quantity(p.quantity() - 1);
			};
		},

		clearAll : function(){
			viewModel.products.remove(function(){
				return true
			});
		},

	};

	return{
		utils : utils,
		Product : Product,
		data: data,
		viewModel : viewModel
	};

};
