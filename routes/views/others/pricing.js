var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.title = 'Support';
	locals.section = 'support';

	// Render the view
	view.render('others/pricing');

};
