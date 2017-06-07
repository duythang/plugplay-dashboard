var keystone = require('keystone'),
    Board = keystone.list('Board');

/**
 * List Boards
 */
exports.getBoards = function(req, res) {
	Board.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			boards: items
		});
		
	});
}

/**
 * Get Board by ID
 */
exports.getBoardById = function(req, res) {
	Board.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse({
			board: item
		});
		
	});
}


/**
 * Create a Board
 */
exports.createBoard = function(req, res) {
	
	var item = new Board.model(),
		data = req.body;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			board: item
		});
		
	});
}

/**
 * Update Board by ID
 */
exports.updateBoardById = function(req, res) {
	Board.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		var data = req.body;
		
		item.getUpdateHandler(req).process(data, function(err) {
			
			if (err) return res.apiError('create error', err);
			
			res.apiResponse({
				board: item
			});
			
		});
		
	});
}

/**
 * Delete Board by ID
 */
exports.deleteBoardById = function(req, res) {
	Board.model.findById(req.params.id).exec(function (err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		item.remove(function (err) {
			if (err) return res.apiError('database error', err);
			
			return res.apiResponse({
				success: true
			});
		});
		
	});
}