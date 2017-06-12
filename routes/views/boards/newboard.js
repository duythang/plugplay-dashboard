var keystone = require('keystone'),
	Board = keystone.list('Board');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.title = 'New Board';
	locals.section = 'newboard';
	locals.form = req.body || {}; // Init 'form'
	locals.validationErrors = {}; // Error from code dev no support

	var numBoard;

	if(locals.user.type === 'Free'){
		numBoard = 1;
	}else if(locals.user.type === 'Small'){
		numBoard = 3;
	}else if(locals.user.type === 'Medium'){
		numBoard = 7;
	}else if(locals.user.type === 'Large'){
		numBoard = 20;	
	}

	view.on('init', function (next) {

		var q = keystone.list('Board').model.count({'createdBy': locals.user.id});

		q.exec(function (err, count) { 

			if (count >= numBoard) {
				req.flash('warning', 'Your number of boards is over ! Contact us to upgrade your account');
				return res.redirect('/myboards');            		
			}
			next(err);
		});
	});

	view.on('post', function (next) {

		var newBoard = new Board.model(),
			data = req.body;

		data.createdBy = locals.user.id;
		data.author = locals.user.username;
		data.boardId = keystone.utils.randomString(10,"0123456789");
		data.createdAt = Date.now();

		newBoard.getUpdateHandler(req).process(data, {
			flashErrors: true,
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors; // no support
			} else {
				req.flash('success', 'Your board has been created');
				//return res.redirect('/boards/' + newBoard.slug);
				return res.redirect('/myboards');
			}
			next();

		});

	});

	// Render the view
	view.render('boards/newboard');

};