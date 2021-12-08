const notesRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

notesRouter.get('/',  async (request, response) => {	
		
	const notes = await Note.find({}).populate('user', { username: 1, name: 1 });
	response.json(notes);
		
	
});

notesRouter.get('/:id', async (request, response) => {

	const note = await Note.findById(request.params.id);
	if(!note){
		return response.status(404).json({ 
			error: 'note not found' 
		});
	}

	response.json(note);
});


notesRouter.delete('/:id', async (request, response) => {

	const note = await 	Note.findById(request.params.id);

	if(!note){
		return response.status(400).json({ 
			error: 'note not found' 
		});
	}

	
	Note.findByIdAndRemove(request.params.id , function (err) {
		if (err) return console.log(err);
		response.status(204).end();
	});
	

});

const getTokenFrom = request => {
	const authorization = request.get('authorization');
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7);
	}
	return null;
};


notesRouter.post('/',  async (request, response) => {
	const body = request.body;
	const token = getTokenFrom(request);
	const decodedToken = jwt.verify(token, process.env.SECRET);
	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' });
	}
	const user = await User.findById(decodedToken.id);
	
	const newNoteContent = {
		content: body.content,
		important: body.important || false,
		date: new Date(),
		user: user._id
	};

	const note = new Note(newNoteContent);

	const savedNote =  await  note.save();

	if(!user){
		await user.save();
		response.json(savedNote);
	}else{
		User.findByIdAndUpdate(
			user._id,
			{ $set: { notes: user.notes.concat(savedNote._id)}},
			(err, userUpdated) => {				
				response.json(userUpdated);
			}
		);	
	}

});



notesRouter.put('/:id', (request, response) => {



	Note.findById(request.params.id)
		.then(note => {
			if(!note){
				return response.status(400).json({ 
					error: 'note not found' 
				});
			}				

			const important = !note.important ;

			Note.findByIdAndUpdate(
				request.params.id,
				{ $set:	{	'important': important} },
				{new: true},
				function (err, note) {
					if (err) return console.log(err);
					response.json(note);
				});

		});
			

});


module.exports = notesRouter;