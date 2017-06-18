var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res),
	    locals = res.locals;

    view.on('post', function (next) {

		keystone.list('Board').model.find().where('createdBy', locals.user.id).exec(function(err, boards){
			if (err) return next(err);
			if (!boards) return next(err);

			boards.map(function (board) {
				
				// Remove Mqtt data of board
				keystone.list('Mqtt').model.find().where('options.boardId', board.boardId).exec(function (err, mqttLog) {
					if (err) return next(err);
					if (!mqttLog) return next(err);  					
					mqttLog.map(function (data) {
						data.remove(function (err) {
							if (err) return next(err);
						});
					});
				});

				// Remove Rest data of board
				keystone.list('Rest').model.find().where('options.boardId', board.boardId).exec(function (err, restLog) {
					if (err) return next(err);
					if (!restLog) return next(err);  					
					restLog.map(function (data) {
						data.remove(function (err) {
							if (err) return next(err);
						});
					});
				});

				// Remove Board
				board.remove(function (err) {
					if (err) return next(err);
				});
				
			});
		});	

		keystone.list('User').model.findById(locals.user.id).exec(function(err, userFound) {
			if (err) return next(err);
			if (!userFound) return next(err);  
			
			userFound.remove(function (err) {
				if (err) return next(err);
				req.flash('success', req.__('routes.deluser.suc_del'));
				return res.redirect(locals.locale+'/signup');
			});	
		});
			
	});

	view.render('/profile');

};