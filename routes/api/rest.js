var keystone = require('keystone'),
    Data = keystone.list('Rest'),
    Board = keystone.list('Board'),
    User = keystone.list('User');

var nullValue = {
    device : '',
    data0 : '',
    data1 : '',
    data2 : '',
};

var prevLength = 0;


/**
 * Get Rest Data
 */
exports.getRestData = function(req, res) {

    // We refer GET '/api/rest/:userKey&boarId&topic'
    var reqUserKey = req.params.id.split('&')[0],
        reqBoardId = req.params.id.split('&')[1],
        reqTopic =   req.params.id.split('&')[2];

    // Authentication
    User.model.findOne({'userKey' : reqUserKey}).exec(function(err, userFound) {
        if (err) return res.apiError('database error', err);
		if (!userFound) return res.apiError('not authenticate');
	});

    var q = Data.model.find()
                .where('options.boardId', reqBoardId)
                .where('topic', reqTopic)
                .sort('-options.time');
    
    q.exec(function(err, results){
        if (err) return res.apiError('database error', err);
		//if (results.length == 0) return res.apiError('not found');

        if (results.length == 0 || (results.length == prevLength)){
            res.apiResponse(
                nullValue
            );
        }else{
            res.apiResponse(
                JSON.parse(results[0].value)
            );
        } 

        prevLength = results.length;
		
    });

}


/**
 * PUT a Rest Data
 */
exports.putRestData = function(req, res) {
	
    // We refer GET '/api/rest/:userKey&boarId&topic'
    var reqUserKey = req.params.id.split('&')[0],
        reqBoardId = req.params.id.split('&')[1],
        reqTopic =   req.params.id.split('&')[2];
	
    // Authentication
    User.model.findOne({'userKey' : reqUserKey}).exec(function(err, userFound) {
        if (err) return res.apiError('database error', err);
		if (!userFound) return res.apiError('not authenticate');
	});

    Board.model.findOne({'boardId' : reqBoardId}).exec(function(err, userFound) {
        if (err) return res.apiError('database error', err);
		if (!userFound) return res.apiError('not authenticate');
	});

    var item = new Data.model();
    var time = new Date();
	var	data = {
            value: JSON.stringify(req.body),
            topic: reqTopic,
            options: {
                boardId: reqBoardId,
                time: Date.now(),  
            }, 
        };
  
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			//board: item
		});
		
	});

}
