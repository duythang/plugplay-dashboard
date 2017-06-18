var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.title = 'User';
	locals.section = 'user';
	locals.tab = 'password';
    locals.form = locals.user;
     
	view.on('post', function(next) {
		
		async.series([

			function(cb) {

				if (!req.body.password || !req.body.password_confirm) {
					req.flash('error', req.__('routes.editpwd.err_fill'));
					return cb(true);
				}

				if (req.body.password.length < 6) {
					req.flash('error', req.__('routes.editpwd.err_pwdLength'));					
					return cb(true);
				}    

				if ( req.body.password != req.body.password_confirm) {
					//req.flash('error', { title: "Error", detail: "Two passwords don't match"});
					req.flash('error', req.__('routes.editpwd.err_pwdMatch'));
					return cb(true);
				}    

				return cb();
			},
			
			function(cb) {
			
				var userData = {
					password: req.body.password
				};
				
				var q = keystone.list('User').model.findById(locals.user.id).exec(function(err, userFound) {
                    if (err) return cb(err);
		            if (!userFound) return cb(err);  
                    
                    userFound.getUpdateHandler(req).process(userData, function(err) {			
                        return cb(err);                       
                    });

                });
			
			}
			
		], function(err){
			
			if (err) return next();
			
			var onSuccess = function() {
				req.flash('success', req.__('routes.editpwd.suc_changePwd'));
 				res.redirect(locals.locale+'/profile');
			}
			
			var onFail = function(e) {
				req.flash('error', req.__('routes.editpwd.err_'));
				return next();
			}
			
			keystone.session.signin({ email: locals.user.email, password: req.body.password }, req, res, onSuccess, onFail);
			
		});
		
	});
	
	view.render('auth/profile');
	
}