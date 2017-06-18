var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.data = {
		board: {},
		isBoardEdited: true,
	};

	// Load all boards
	view.on('init', function (next) {

		var q = keystone.list('Board').model.findOne({ slug: req.params.boardslug });

		q.exec(function (err, result) {

			if (result != null) {
				
				locals.data.board = result;
				locals.title = locals.data.board.title;
				
				/**
				 * Authentication for types of a Board
				 */

				if (locals.user == null){
					if (locals.data.board.type == 'Private')
						return res.status(404).render('errors/404');
					else if (locals.data.board.type == 'Public'){
						locals.data.isBoardEdited = false;
					}
					locals.userType = 'Large';
				}
				else{
					if (locals.data.board.type == 'Private'){
						if(locals.data.board.createdBy != locals.user.id)
							return res.status(404).render('errors/404');
					}else if (locals.data.board.type == 'Public'){
						if(locals.data.board.createdBy != locals.user.id)
							locals.data.isBoardEdited = false;
					}
					locals.userType = locals.user.type;
				}
		
			}
			else {
				return res.status(404).render('errors/404');
			}

			next(err);
		});
	});

	// Render the view
	view.render('boards/singleboard');

};
