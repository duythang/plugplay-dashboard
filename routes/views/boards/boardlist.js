var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.title = 'Boards'
	locals.section = 'boards';
	locals.data = {
		boards: [],
		perpage: 9,
	};

	// Load all tickets
	view.on('init', function (next) {

		var q = keystone.list('Board').paginate({
			page: req.query.page || 1,
			perPage: 9,
			maxPages: 5000
		}); 

		q.find().where('type', 'Public').sort('-createdAt').exec(function (err, results) {
			locals.data.boards = results;
			next(err);
		});

	});


	// Render the view
	view.render('boards/boardlist');

};
