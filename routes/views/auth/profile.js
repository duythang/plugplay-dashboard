var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.title = 'Profile';
	locals.section = 'user';
    locals.form = locals.user;

	view.on('post', function (next) {

		var userData = {
			name: {
				first: req.body.firstname,
				last: req.body.lastname,
			},
			countryCode: req.body.countryCode,
			tel: req.body.tel,
			location: req.body.location,
		};

		var q = keystone.list('User').model.findById(locals.user.id).exec(function(err, result) {
			if (!result) return next(err); 
			
			result.getUpdateHandler(req).process(userData, function(err) {
				req.flash('success', req.__('routes.profile.suc_changeProfile'));			
				return res.redirect(locals.locale+'/profile')                   
			});
        });
		
	});

	view.render('auth/profile');
	
}