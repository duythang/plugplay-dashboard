var keystone = require('keystone'),
    Data = keystone.list('Mqtt'),
    Board = keystone.list('Board'),
    User = keystone.list('User');


/**
 * Get Rest Data
 */
exports.getNumPass = function(req, res) {

	var i;
	var timeStamp = 0;
	var numReg = 0;
	var numDis = 0;
	var object = {};

    // We refer GET '/api/rest/:userKey&boarId&arr_station&req_station'
    var reqUserKey  = req.params.id.split('&')[0],
        reqBoardId  = req.params.id.split('&')[1],
		arr_station = req.params.id.split('&')[2],
		req_station = req.params.id.split('&')[3];

	var	topic_arr_station = reqBoardId + "/" + arr_station;
	var	topic_req_station = reqBoardId + "/" + req_station;

    // Authentication
    User.model.findOne({'userKey' : reqUserKey}).exec(function(err, userFound) {
        if (err) return res.apiError('database error', err);
		if (!userFound) return res.apiError('not authenticate');
	});


	var q_arr_station = Data.model.find()
				.where('options.boardId', reqBoardId)
				.where('topic', topic_arr_station)
				.sort('-options.time');

	q_arr_station.exec(function(err, results){

		if (err) return res.apiError('database error', err);

		if (results.length == 0){
			timeStamp = 0;
		}else{
			for (i = 0; i < results.length; i++) { 
				object = JSON.parse(results[i].value);
				if(object.data0 == 0){
					timeStamp = results[i].options.time;
					break;
				}else{
					// Should not happen
				}
			}
		}
		
		var q_req_station = Data.model.find()
					.where('options.boardId', reqBoardId)
					.where('topic', topic_req_station)
					.sort('-options.time');

		q_req_station.exec(function(err, results){
			if (err) return res.apiError('database error', err);
			
			if (results.length == 0){
				res.apiResponse(
					numPass
				);
			}else{
				for (i = 0; i < results.length; i++) { 
					if(results[i].options.time > timeStamp){
						object = JSON.parse(results[i].value);
						if(object.data0 == 1){
							numReg = numReg + 1;
						}else{
							numDis = numDis + 1;
						}		
					}
				}

				numReg = numReg - numDis;
				if(numReg < 0) numReg = 0;
				console.log(numReg);

				var numPass = {
					device : 'numPass',
					data0 : numReg,
					data1 : '',
					data2 : '',
				};

				res.apiResponse(
					numPass
				);
			}
		});

	});
	
}

