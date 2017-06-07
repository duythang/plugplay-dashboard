var keystone = require('keystone');
var User = keystone.list('User');

module.exports = function (done) {
	new User.model({
		username: 'pdthang',
		name: {
			first: 'Thang',
			last: 'Phan'
		},
		type: 'Large',
		email: 'pdthang59@gmail.com',
		location: 'Vietnam',
		countryCode: 82,
		tel: 1065922210,
		password: 'Thangphan90',
		userKey: 'abc050990XYZ',
		isAdmin: true,
	})
	.save(done);
};
