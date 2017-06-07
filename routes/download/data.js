var keystone = require('keystone');
var csv = require('csv');
var Mqtt = keystone.list("Mqtt"),
	Rest = keystone.list("Rest");

var tmp = [{value:'value', topic: 'topic', time: 'time'}];

exports = module.exports = function (req, res) {

	Mqtt.model.find().where('options.boardId', req.params.id).exec(function (err, results) {
		if (err) { throw err; }
		
		tmp = tmp.concat(results.map(function (data) {
			return {
				value: data.value,
				topic: data.topic.split('/')[1],
				time: String(data.options.time), // TODO
			}
		}));

        Rest.model.find().where('options.boardId', req.params.id).exec(function (err, results) {
            if (err) { throw err; }
            
            tmp = tmp.concat(results.map(function (data) {
                return {
                    value: data.value,
                    topic: data.topic,
                    time: String(data.options.time), // TODO
                }
            }));

            tmp.sort(function(a,b){	
                return new Date(b.time)-new Date(a.time);
            });
            
            csv.stringify(tmp, function (err2, data) {
                if (err2) { throw err; }

                res.set({"Content-Disposition": "attachment; filename=\"DataLog.csv\""});
                res.send(data);
            });
        });
	
	});

	
}; 