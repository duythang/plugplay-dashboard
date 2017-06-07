
var keystone = require('keystone');
var Types = keystone.Field.Types;


var User = new keystone.List('User', {
	autokey: { path: 'slug', from: 'username', unique: true },
});
 
User.add({
    username: { type: String, initial: true, required: true, unique: true, index: true, default:'' },
	name: { type: Types.Name, index: true },
	type: {type: Types.Select, options: 'Free, Small, Medium, Large', index: true, default: 'Free'}, 
	email: { type: Types.Email, initial: true, required: true, index: true, unique: true },
	location: {type: String, index: true,  default:''},
	countryCode: {type: Types.Number, index: true },
	tel:{type: Types.Number, index: true },
	password: { type: Types.Password, initial: true, required: true},
    resetPasswordKey: { type: String},
	userKey : { type: String, unique: true},
	upgradeUserTypeAt: { type: Date, index: true, default: Date.now() },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

 User.schema.virtual('url').get(function() {
    return '/users'+this.slug;
 });


User.relationship({ path: 'boards', ref: 'Board', refPath: 'createdBy' });
 


User.track = true;
User.defaultColumns = 'username, email, isAdmin';
User.register();

