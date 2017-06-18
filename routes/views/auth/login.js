var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;

	if (req.user) {
		return res.redirect(locals.locale+'/myboards');
	}
	
	locals.title = 'Login';
	locals.section = 'login';

	view.on('post', function(next) {
		
		if (!req.body.email || !req.body.password) {
			req.flash('error', req.__('routes.login.err_fill'));
			return next();
		}
		
		var onSuccess = function() {
			req.flash('success', req.__('routes.login.suc_login'));
			res.redirect(locals.locale+'/myboards');
		}
		
		var onFail = function() {
			req.flash('error', req.__('routes.login.err_'));
			return next();
		}
		
		keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
		
	});
	
	view.render('auth/login');
	
}
