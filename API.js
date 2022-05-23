const NotesAPI={
    getAllNotes(){
        const notes =JSON.parse(localStorage.getItem("notesapp-notes")||"[]");
        return notes
    },

    saveNote(noteToSave){
        const notes = NotesAPI.getAllNotes();
        const existing =notes.find(note=>note.id==noteToSave.id)

        if(existing){
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = noteToSave.updated;

        }
        else{
            noteToSave.id =Date.now();
            noteToSave.updated = new Date().toISOString();
            noteToSave.creation= new Date().toISOString();
            notes.unshift(noteToSave);
        }

        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
        
    },

    deleteNote(id){
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note =>note.id != id);
        
        localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
    },

    switchNotes(id1,id2){
        const notes = NotesAPI.getAllNotes();
        const fromIndex = notes.indexOf(notes.find(el=> el.id== id1));
        console.log("fI: "+ fromIndex);
        const beforeIndex=notes.indexOf(notes.find(el=> el.id== id2)) -1;
        console.log("bI: " + beforeIndex);
        const removed = notes.splice(fromIndex,1)[0];
        if(id2 == null){
            notes.push(removed);
        }
        else{
           
            notes.splice(beforeIndex ,0,removed);
        }
        
        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
    }

}

export default  NotesAPI;