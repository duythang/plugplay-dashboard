var keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;

	view.on('get', function(next) { // Issue: Change 'init' to 'get'
		User.model.findOne().where('resetPasswordKey', req.params.key).exec(function(err, userFound) {
			if (err) return next(err);
			if (!userFound) {
				req.flash('error', "Sorry, That reset password key isn't valid.");
				return res.redirect('/forgotpassword');
			}
			locals.key =  req.params.key;
			next();
		});
		 
	});
	
	view.on('post', function(next) {

		if (req.body.password.length < 6) {
			req.flash('error', 'Enter more than 6 characters for password');
			return res.redirect('/resetpassword/'+req.body.resetkey); // Issue change 'req.params.key' to req.body.resetkey
		}
		
		if (!req.body.password || !req.body.password_confirm) {
			req.flash('error', "Enter and confirm your new password.");
			return res.redirect('/resetpassword/'+req.body.resetkey); 
		}
		
		if (req.body.password != req.body.password_confirm) {
			req.flash('error', 'Make sure both passwords match.');
			return res.redirect('/resetpassword/'+req.body.resetkey);
		}
		
        User.model.findOne().where('resetPasswordKey', req.body.resetkey).exec(function(err, userFound) {
			if (err) return next(err);
			userFound.password = req.body.password;
           	userFound.resetPasswordKey = '';
            userFound.save(function(err) {
                if (err) return next(err);
                req.flash('success', 'Your password has been reset, please sign in.');
                res.redirect('/signin');
            });
		});
         
	});
	
	view.render('auth/resetpassword');
};