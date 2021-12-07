const notesRouter = require('express').Router();
const Note = require('../models/note');



notesRouter.get('/', (request, response) => {	
		
	Note.find({}).then(notes => {
		response.json(notes);
		
	});
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




notesRouter.post('/',  async (request, response) => {
	const body = request.body;


	const newNoteContent = {
		content: body.content,
		important: body.important || false,
		date: new Date()
	};

	const note = new Note(newNoteContent);

	const savedNote =  await  note.save();
	response.json(savedNote);
	

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