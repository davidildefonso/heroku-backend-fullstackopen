const Note = require('../models/note');
const User = require('../models/user');

const initialNotes = [
	{
		content: 'HTML is easy',
		date: new Date(),
		important: false
	},
	{
		content: 'Browser can execute only Javascript',
		date: new Date(),
		important: true
	}
];

const nonExistingId = async () => {
	const note = new Note({ content: 'willremovethissoon', date: new Date() });
	await note.save();
	await note.remove();

	return note._id.toString();
};

const notesInDb = async () => {
	const notes = await Note.find({});
	return notes.map(note => note.toJSON());
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map(user => user.toJSON());
};

const insertMany = async (notes) => {
	const noteObjects = notes
		.map(note => new Note(note));
	const promiseArray = noteObjects.map(note => note.save());
	await Promise.all(promiseArray);
};

module.exports = {
	initialNotes, nonExistingId, notesInDb,insertMany, usersInDb
};