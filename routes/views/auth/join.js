var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	if (req.user) {
		return res.redirect('/myboards');
	}
	
	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.title = 'User';
	locals.section = 'user';
	locals.form = req.body;
     
	view.on('post', function(next) {
		
		async.series([
			
			function(cb) {
				
				if (!req.body.username || !req.body.email || !req.body.password) {
					req.flash('error', 'Enter all required fields');
					return cb(true);
				}
				
				return cb();
				
			},

			function(cb) {
				
				req.body.username = req.body.username.toLowerCase();

				if ( req.body.password != req.body.password_confirm) {
					req.flash('error', "Two passwords don't match");
					return cb(true);
				}

				if (req.body.password.length < 6) {
					req.flash('error', 'Enter more than 6 characters for password ');
					return cb(true);
				}

				return cb();

			},
            
            function(cb) {
				
				keystone.list('User').model.findOne({ username: req.body.username }, function(err, user) {
					
					if (err || user) {
						req.flash('error', 'User already exists with that Username.');
						return cb(true);
					}
					
					return cb();
					
				});
				
			},
			
			function(cb) {
				
				keystone.list('User').model.findOne({ email: req.body.email }, function(err, user) {
					
					if (err || user) {
						req.flash('error', 'User already exists with that email address.');
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
				req.flash('success', 'Signed up successfully.');
 				res.redirect('/myboards');
			}
			
			var onFail = function(e) {
				req.flash('error', 'There was a problem signing you up, please try again.');
				return next();
			}
			
			keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
			
		});
		
	});
	
	view.render('auth/join');
	
}