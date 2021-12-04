const notesRouter = require('express').Router();
const Note = require('../models/note');



notesRouter.get('/', (request, response, next) => {	
		
	Note.find({}).then(notes => {
		response.json(notes);
		
	}).catch(error => next(error) );
});

notesRouter.get('/:id', async (request, response, next) => {
	try {
		const note = await Note.findById(request.params.id);
		response.json(note);
	} catch (error) {
		next(error);
	}

});


notesRouter.delete('/:id', async (request, response, next) => {

	try {
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

	} catch (error) {
		next(error);
	}
	

});




notesRouter.post('/',  async (request, response, next) => {
	const body = request.body;


	const newNoteContent = {
		content: body.content,
		important: body.important || false,
		date: new Date()
	};

	const note = new Note(newNoteContent);

	try {
		const savedNote =  await  note.save();
		response.json(savedNote);

	} catch (error) {
		next(error);
	}
	
	

});



notesRouter.put('/:id', (request, response, next) => {



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

		}).catch(error => next(error) );
			

});


module.exports = notesRouter;