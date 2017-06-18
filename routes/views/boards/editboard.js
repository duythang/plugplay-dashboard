var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res),
	    locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.title = 'New Board'
	locals.section = 'newboard';

	// Load all boards
	view.on('init', function (next) {

		var q = keystone.list('Board').model.findOne({ slug: req.params.boardslug });

		q.exec(function (err, result) {
			if (result != null) {

				if (result.createdBy == locals.user.id){
                    locals.form = result;
                }               
                else{
                    return res.status(404).render('errors/404');
                }                 
		
			}
			else {
				return res.status(404).render('errors/404');
			}

			next(err);
		});
	});

    view.on('post', function (next) {

        var boardData = {
            title: req.body.title,
            type: req.body.type,
            createdBy: locals.user.id,
            //createdAt: Date.now()     
        };

		var q = keystone.list('Board').model.findOne({ slug: req.params.boardslug }).exec(function(err, result) {

            if (!result) return next(err);
            
            result.getUpdateHandler(req).process(boardData, function(err) {   

                req.flash('success', req.__('routes.editboard.suc_changeBoard'));	
				return res.redirect(locals.locale+'/myboards') 

            });

        });

	});

	// Render the view
	view.render('boards/editboard');

};
