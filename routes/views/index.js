var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
		locals = res.locals;

	view.on('init', function (next) {

		keystone.list('User').model.count().exec(function (err, count) { 
			locals.totalUser = count;
			keystone.list('Board').model.count().exec(function (err, count) { 
				locals.totalBoard = count;
				next(err);
			});
		});

	});

	view.render('index');
 
}
