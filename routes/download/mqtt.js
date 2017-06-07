var keystone = require('keystone');
var csv = require('csv');
var Data = keystone.list("Mqtt"); 

exports = module.exports = function (req, res) {
	//console.log(req.params.key);
	Data.model.find().where('options.boardId', req.params.id).exec(function (err, results) {
		if (err) { throw err; }
		
		var tmp = results.map(function (data) {
			return {
				value: data.value,
				topic: data.topic.split('/')[1],
				time: String(data.options.time), // TODO
			}
		});
		tmp.unshift({value:'value', topic: 'topic', time: 'time'});
		
		csv.stringify(tmp, function (err2, data) {
			if (err2) { throw err; }

			res.set({"Content-Disposition": "attachment; filename=\"MqttData.csv\""});
			res.send(data);
		});
	});
}; 