var keystone = require('keystone');
var Types = keystone.Field.Types;

var Board = new keystone.List('Board',{
	autokey: { path: 'slug', from: 'title', unique: true },
});

var defaultContent = {
    "version":"application/octet-stream",
    "allow_edit":true,
    "plugins":[],
    "panes":[],
    "datasources":[],
    "columns":3,
}

Board.add({
        title: { type: String, initial: true, default: '', required: true },
        type: {type: Types.Select, initial: true, options: 'Public, Private', default: 'Public'},
        content: {type: String, default: JSON.stringify(defaultContent)},    
        boardId : { type: String, unique: true},
        author:{type: String, default: 'User'},
        createdBy: { type: Types.Relationship, ref: 'User', index: true },
        createdAt: { type: Date, default: Date.now() },
    });
    
Board.schema.virtual('url').get(function() {
	return '/boards/'+this.slug;
	 
});


Board.defaultSort = '-createdAt';
Board.defaultColumns = 'title, type|20%, createdBy, createdAt|15%'; 
Board.register();