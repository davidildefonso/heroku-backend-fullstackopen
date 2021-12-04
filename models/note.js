
const mongoose = require('mongoose');


const url = process.env.MONGODB_URI;
//  `mongodb+srv://admin:${password}@cluster0.r0mb0.mongodb.net/note-app?retryWrites=true&w=majority`;
console.log(url);
mongoose.connect(url)
	.then(() => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message);
	});


//const password = process.argv[2];


const noteSchema = new mongoose.Schema({
	content: {
		type: String,
		minLength: 5,
		required: true
	},
	date: { 
		type: Date,
		required: true
	},
	important: Boolean
});

noteSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('Note', noteSchema);

