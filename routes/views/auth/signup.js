var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;

	if (req.user) {
		return res.redirect(locals.locale+'/myboards');
	}

	locals.title = 'Sign up';
	locals.section = 'user';
	locals.form = req.body;
     
	view.on('post', function(next) {
		
		async.series([
			
			function(cb) {
		
				if (!req.body.username || !req.body.email || !req.body.password) {
					req.flash('error', req.__('routes.signup.err_fill'));
					return cb(true);
				}

				if (req.body.password.length < 6) {
					req.flash('error', req.__('routes.signup.err_pwdLength'));
					return cb(true);
				}

				if ( req.body.password != req.body.password_confirm) {
					req.flash('error', req.__('routes.signup.err_pwdMatch'));
					return cb(true);
				}

				req.body.username = req.body.username.toLowerCase();
				
				return cb();
				
			},
            
            function(cb) {
				
				keystone.list('User').model.findOne({ username: req.body.username }, function(err, user) {
					
					if (err || user) {
						req.flash('error', req.__('routes.signup.err_userExist'));
						return cb(true);
					}
					
					return cb();
					
				});
				
			},
			
			function(cb) {
				
				keystone.list('User').model.findOne({ email: req.body.email }, function(err, user) {
					
					if (err || user) {
						req.flash('error', req.__('routes.signup.err_emailExist'));
						return cb(true);
					}
					
					return cb();
					
				});
				
			},
			
			function(cb) {
			
				var userData = {
                    username: req.body.username,
					name: {
						first: req.body.firstname,
						last: req.body.lastname,
					},
					email: req.body.email,
					password: req.body.password,
					userKey : keystone.utils.randomString(12),
				};
				
				var User = keystone.list('User').model,
					newUser = new User(userData);
				
				newUser.save(function(err) {
					return cb(err);
				});
			
			}
			
		], function(err){
			
			if (err) return next();
			
			var onSuccess = function() {
				req.flash('success', req.__('routes.signup.suc_signup'));
 				res.redirect(locals.locale+'/myboards');
			}
			
			var onFail = function(e) {
				req.flash('error', req.__('routes.signup.err_'));
				return next();
			}
			
			keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
			
		});
		
	});
	
	view.render('auth/signup');
	
}