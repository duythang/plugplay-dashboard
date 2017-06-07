var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res),
	    locals = res.locals;
    
    view.on('post', function (next) {

		keystone.list('Board').model.findOne({ slug: req.params.boardslug }).exec(function(err, boardFound) {

            if (!boardFound) return next(err);

            if (boardFound.createdBy != locals.user.id)
                return res.status(404).render('errors/404');
            
            // Remove Mqtt data of board
            keystone.list('Mqtt').model.find().where('options.boardId', boardFound.boardId).exec(function (err, mqttLog) {
                if (err) return next(err);
                if (!mqttLog) return next(err);  					
                mqttLog.map(function (data) {
                    data.remove(function (err) {
                        if (err) return next(err);
                    });
                });
            });

            // Remove Rest data of board
            keystone.list('Rest').model.find().where('options.boardId', boardFound.boardId).exec(function (err, restLog) {
                if (err) return next(err);
                if (!restLog) return next(err);  					
                restLog.map(function (data) {
                    data.remove(function (err) {
                        if (err) return next(err);
                    });
                });
            });
            
            boardFound.remove(function (err) {
                if (err) return next(err);
                req.flash('success', 'Deleted board successfully');
                return res.redirect('/myboards');
            });

        });

	});

    view.render('/myboards');
};