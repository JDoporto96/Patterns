import NotesAPI from "./API.js";
import App from "./app.js";

class CommandManager{
    constructor() {
        this.history =[];
    }
    executeCommand(command, ...args){
        command.execute(...args);
        this.history.push(command);
    }
    undoCommand(){
        if(this.history.length>0){
            const command=this.history.pop()
            command.undo();
        }
        
    }
}

class AddNoteCommand{
    constructor(){
    }
    execute(){
        const newNote={
            title: "",
            body:""
        };
        NotesAPI.saveNote(newNote);
        const notes= NotesAPI.getAllNotes();
        this.noteId= notes[0].id;
        
    }
    undo(){
        NotesAPI.deleteNote(this.noteId);
    }
}

class EditNoteCommand{
    constructor(note){
        this.note =note;
    }
    execute(title, body){
        NotesAPI.saveNote({
            id: this.note.id,
            creation: this.note.creation,
            title: title,
            body: body,
            updated:  new Date().toISOString()
        });
    }
    undo(){
        NotesAPI.saveNote({
            id: this.note.id,
            creation: this.note.creation,
            title: this.note.title,
            body: this.note.body,
            updated:  new Date().toISOString()
        });
    }
}

class DeleteNoteCommand{
    constructor(note){
        this.note=note;
    }

    execute(){
        const noteId= this.note.id;
        NotesAPI.deleteNote(noteId);
        console.log(this.note)
    }
    undo(){
        const notes = NotesAPI.getAllNotes();
        notes.push(this.note);
        localStorage.setItem("notesapp-notes", JSON.stringify(notes));


    }
}


export{CommandManager,AddNoteCommand,DeleteNoteCommand,EditNoteCommand};


