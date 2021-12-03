const express = require("express");

require('dotenv').config();


const Note = require('./models/note');



const app = express();

app.use(express.json({strict: false}));

const cors = require('cors');
app.use(cors());

app.use(express.static('build'));




app.get("/", (request, response, next ) => {
		try{
				response.send("<h1>Hello world</h1>");
		}catch(error){
			 next(error) ;
		}



});

app.get("/api/notes", (request, response, next) => {
	
		
		Note.find({}).then(notes => {
				response.json(notes);
			
		}).catch(error => next(error) );
});

app.get('/api/notes/:id', (request, response, next) => {
 

	Note.findById(request.params.id).then(note => {
    response.json(note)
  }).catch(error => next(error) );


});


app.delete('/api/notes/:id', (request, response, next) => {

		Note.findById(request.params.id)
			.then(note => {
						if(!note){
								return response.status(400).json({ 
									error: 'note not found' 
								});
						}				

						Note.findByIdAndRemove(request.params.id , function (err, note) {
							if (err) return console.log(err);
							response.status(204).end();
						});

			}).catch(error => next(error) );
	




});




app.post('/api/notes', (request, response, next) => {
		const body = request.body;


		const newNoteContent = {
			content: body.content,
			important: body.important || false,
			date: new Date()
		};

		const note = new Note(newNoteContent);

		note.save().then(savedNote => {
			response.json(savedNote)
		}).catch(error => next(error) );

})



app.put('/api/notes/:id', (request, response, next) => {



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
								{ $set:	{	"important": important} },
								{new: true},
								function (err, note) {
									if (err) return console.log(err);
									response.json(note)
						})

			}).catch(error => next(error) );
			

});



const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    	return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError'){
			return response.status(400).json({ error: error.message })
	}

  next(error);
}

app.use(errorHandler);



const PORT  =  process.env.PORT;

app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
});
