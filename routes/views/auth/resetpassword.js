var keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;

	view.on('get', function(next) { // Issue: Change 'init' to 'get'
		User.model.findOne().where('resetPasswordKey', req.params.key).exec(function(err, userFound) {
			if (err) return next(err);
			if (!userFound) {
				req.flash('error', req.__('routes.resetpwd.err_pwdKey'));
				return res.redirect(locals.locale+'/forgotpassword');
			}
			locals.key =  req.params.key;
			next();
		});
		 
	});
	
	view.on('post', function(next) {

		if (!req.body.password || !req.body.password_confirm) {
			req.flash('error', req.__('routes.resetpwd.err_fill'));
			return res.redirect(locals.locale+'/resetpassword/'+req.body.resetkey); 
		}

		if (req.body.password.length < 6) {
			req.flash('error', req.__('routes.resetpwd.err_pwdLength'));
			return res.redirect(locals.locale+'/resetpassword/'+req.body.resetkey); // Issue change 'req.params.key' to req.body.resetkey
		}
			
		if (req.body.password != req.body.password_confirm) {
			req.flash('error', req.__('routes.resetpwd.err_pwdMatch'));
			return res.redirect(locals.locale+'/resetpassword/'+req.body.resetkey);
		}
		
        User.model.findOne().where('resetPasswordKey', req.body.resetkey).exec(function(err, userFound) {
			if (err) return next(err);
			userFound.password = req.body.password;
           	userFound.resetPasswordKey = '';
            userFound.save(function(err) {
                if (err) return next(err);
                req.flash('success', req.__('routes.resetpwd.suc_resetPwd'));
                res.redirect(locals.locale+'/login');
            });
		});
         
	});
	
	view.render('auth/resetpassword');
};