var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var locals = res.locals;

	keystone.session.signout(req, res, function() {
		res.redirect(locals.locale);
	});
	
};