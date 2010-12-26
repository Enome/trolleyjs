(function(){
		
	//Setup
	var setDown = {
		setup : function(){
			Trolley().utils.cookie.erase('trolley');
		},
		teardown : function(){ }
	};

	//Utils
	module('Utils', setDown);

	test('Can create/read/erase cookie', function(){
		var cookie  = Trolley().utils.cookie;
		var data = 'foobar';

		equals(cookie.read('trolley'), null);

		cookie.create('trolley', data, 14);
		equals(cookie.read('trolley'), data);

		cookie.erase('trolley');
		equals(cookie.read('trolley'), null);
	});

	//Product
	module('Product', setDown);

	test('can set name and price', function(){
		var product = Trolley().Product('foobar', 14);

		equals(product.name, 'foobar');
		equals(product.price, 14);
	});

	test('Throw if name is "" or undefined', function(){
		raises( function(){
			var product = Trolley().Product('', 15);
		});

		raises( function(){
			var product = Trolley().Product(undefined, 15);
		});
	});

	test('Throw if price is not NaN', function(){
		raises( function(){
			var product = Trolley().Product('foobar', 'xyz');
		});

		raises( function(){
			var product = Trolley().Product('foobar', undefined);
		});

		raises( function(){
			var product = Trolley().Product('foobar');
		});
	});

	test('Default quantity is 1', function(){
		var product = Trolley().Product('foobar', 1);
		equals( product.quantity(), 1);
	});

	test('Should return total price of a product', function(){
		var trolley = Trolley();
		var viewModel = trolley.viewModel;
		var p = trolley.Product('foo', 0.11);

		p.quantity(5);
		
		equals(p.totalPrice(), 0.55);
	});

	//ViewModel
	module('ViewModel', setDown);
	
	test('Get product', function(){
		var trolley = Trolley();
		var viewModel = trolley.viewModel;
		var p1 = trolley.Product('foo', 1);
		var p2 = trolley.Product('bar', 2);

		viewModel.products = ko.observableArray([ p1, p2 ]);

		var p1_ = viewModel.getProduct('foo');
		equals(p1, p1_)

		var p2_ = viewModel.getProduct('bar');
		equals(p2, p2_);
	});

	test('addProduct adds a product to viewModel.products', function(){
		var trolley = Trolley();
		var viewModel = trolley.viewModel;
		var product = trolley.Product('foobar', 1);

		equals(viewModel.products().length, 0);

		viewModel.addProduct(product);
		equals(viewModel.products().length, 1);
		equals(viewModel.products()[0], product);
	});

	test('Adding the same products updates the quanity not length', function(){
		var trolley = Trolley();
		var viewModel = trolley.viewModel;
		var product = trolley.Product('bar', 1);

		viewModel.addProduct(product);
		equals(viewModel.products().length, 1);
		equals(viewModel.products()[0].quantity(), 1);

		viewModel.addProduct(product);
		equals(viewModel.products().length, 1);
		equals(viewModel.products()[0].quantity(), 2);
	});

	test('removeProduct subtracts 1 from quantity', function(){
		var trolley = Trolley();
		var viewModel = trolley.viewModel;
		var product = trolley.Product('bar', 1);

		viewModel.addProduct(product);
		viewModel.addProduct(product);

		equals(viewModel.products()[0].quantity(), 2);
		viewModel.removeProduct(product);
		equals(viewModel.products()[0].quantity(), 1);
	});

	test('removeProduct with all=true removes the whole product', function(){
		var trolley = Trolley();
		var viewModel = trolley.viewModel;
		var product = trolley.Product('bar', 1);

		viewModel.addProduct(product);
		viewModel.addProduct(product);

		equals(viewModel.products()[0].quantity(), 2);
		viewModel.removeProduct(product, true);
		equals(viewModel.products()[0], null);
	});

	test('removeProduct should remove the whole product if quantity is 0', function(){
		var trolley = Trolley();
		var viewModel = trolley.viewModel;
		var product = trolley.Product('bar', 1);

		viewModel.addProduct(product);

		equals(viewModel.products()[0].quantity(), 1);
		viewModel.removeProduct(product);
		equals(viewModel.products()[0], null);
	});

	test('clearAll removes all the products', function(){
		var trolley = Trolley();
		var viewModel = trolley.viewModel;
		var product = trolley.Product('bar', 1);

		viewModel.addProduct(product);
		viewModel.addProduct(product);

		equals(viewModel.products()[0].quantity(), 2);
		viewModel.clearAll();
		equals(viewModel.products().length, 0);
	});

	//Product aggregations
	
	module('Product Aggregations', setDown);
	
	test('Should return total price of all products', function(){
		var trolley = Trolley();
		var viewModel = trolley.viewModel;
		var p1 = trolley.Product('foo', 5);
		var p2 = trolley.Product('bar', 5);

		p1.price = '5';
		p1.quantity(5);

		p2.quantity(2);

		viewModel.addProduct(p1);
		viewModel.addProduct(p2);

		equals(viewModel.products.price(), ((5 * 5) + (5 * 2)).toFixed(2));
	});

	test('Should return total quantity of all products', function(){
		var trolley = Trolley();
		var viewModel = trolley.viewModel;
		var p1 = trolley.Product('foo', '5');
		var p2 = trolley.Product('bar', 5);

		p1.quantity('5');
		p2.quantity(2);

		viewModel.addProduct(p1);
		viewModel.addProduct(p2);

		equals(viewModel.products.quantity(), 7);
	});

	//Cookie writing also known as the amazing data layer
	module('Cookie writing', setDown);

	test('Should write when quantity changes', function(){

	});

	test('Should write when product gets added', function(){

	});
})();
