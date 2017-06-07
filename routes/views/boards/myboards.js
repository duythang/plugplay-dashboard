var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;		

	locals.title = 'New Board'
	locals.section = 'newboard';
	locals.data = {
		boards: [],
	}; 

	// Load all tickets
	view.on('init', function (next) {

		//== Check payment for one month
		if(locals.user.type != 'Free'){
			
			var now    = new Date();			
			now.setMonth(now.getMonth() - 1);
			// Zero the hours
			now.setHours(locals.user.upgradeUserTypeAt.getHours()+1, 0, 0);
			// Zero the milliseconds
			//now.setMilliseconds(0);

			if (now > locals.user.upgradeUserTypeAt){ // Update User Type

				var userData = {
					type: 'Free',
				};
				
				var q = keystone.list('User').model.findById(locals.user.id).exec(function(err, userFound) {
                    if (err) return next(err);
		            if (!userFound) return next(err);  
                    
                    userFound.getUpdateHandler(req).process(userData, function(err){			                   
                    });

                });
			} 
		} 

		var q = keystone.list('Board').model.find().where('createdBy', locals.user.id).sort('-createdAt');

		q.exec(function (err, results) {
			locals.data.boards = results;
			next(err);
		});

	});

	// Render the view
	view.render('boards/myboards');

};
