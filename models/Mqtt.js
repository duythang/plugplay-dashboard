var keystone = require('keystone');
var Types = keystone.Field.Types;
//var mongoose = keystone.mongoose;
//var Schema = mongoose.Schema;

var Data = new keystone.List('Mqtt'); // TODO


Data.add({ 
        value: {type: String},
        topic : {type: String},
        options: {
                    boardId: {type: String},
                    time: { type: Date},  
		            qos: { type: Number},
		            messageId: { type: String},
                    clientId: { type: String},
                },    
    });
//Data.schema.add({value : Schema.Types.Mixed},);  
//Data.schema.add({ value: mongoose.Schema.Types.Buffer });

Data.defaultColumns = 'value, topic|20%, options|15%'; 
Data.register();