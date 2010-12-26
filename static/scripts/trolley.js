var Trolley = function(){

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

	var Product = function(name, price){
		if( name === undefined || name === '' ){
			throw new Error('Name is empty');
		};

		if( isNaN( parseFloat(price) ) ){
			throw new Error('Price is not a valid number');
		};

		var $this = {};
		$this.name = name;
		$this.price = parseFloat(price);
		$this.quantity = ko.observable(1);
		$this.totalPrice = function(){
			return $this.price * $this.quantity();
		};	

		$this.quantity.subscribe(function(v){
			if(v == 0){
				viewModel.removeProduct($this, true);
			};
		});

		return $this;
	};
	
	var viewModel = {
		products : (function(){
			var k = ko.observableArray([]);

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

		addProduct : function(product){
			var p = viewModel.getProduct(product.name);
			if(p){
				p.quantity(p.quantity() + 1);
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
		}
	};

	return{
		utils : utils,
		Product : Product,
		viewModel : viewModel
	};

};
