import NotesAPI from "./API.js";

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
        
    }
    undo(){
        const notes = NotesAPI.getAllNotes();
        notes.push(this.note);
        localStorage.setItem("notesapp-notes", JSON.stringify(notes));


    }

}
class SwitchNoteCommand{
    constructor(id1,id2){
        this.notes=NotesAPI.getAllNotes();
        this.id1=id1;
        this.id2=id2;
        console.log(this.id2)
        this.fromIndex=this.notes.indexOf(this.notes.find(el=> el.id== this.id1));
        this.beforeIndex=this.notes.indexOf(this.notes.find(el=> el.id== this.id2)) -1;
        console.log(this.beforeIndex);
        this.removed= this.notes.splice(this.fromIndex,1)[0];
    }
    execute(){
        if(this.id2 == null){
            this.notes.push(this.removed);
        }
        else{
           
            this.notes.splice(this.beforeIndex ,0,this.removed);
        }
        
        localStorage.setItem("notesapp-notes", JSON.stringify(this.notes));
    
    }
    undo(){
        console.log("UNDO")
        if(this.id2 == null){
           
            this.notes.splice(this.notes.indexOf(this.notes.find(el=> el.id== this.id1)),1);
            this.notes.splice(this.fromIndex,0,this.removed);
        }
        else{
        this.notes.splice(this.beforeIndex,1);
        this.notes.splice(this.fromIndex,0,this.removed);
        
        }
        localStorage.setItem("notesapp-notes", JSON.stringify(this.notes));
    }
}


export{CommandManager,AddNoteCommand,DeleteNoteCommand,EditNoteCommand, SwitchNoteCommand};


