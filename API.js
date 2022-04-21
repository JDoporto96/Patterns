const NotesAPI={
    getAllNotes(){
        const notes =JSON.parse(localStorage.getItem("notesapp-notes")||"[]");
        return notes.sort((a,b)=>{
            return new Date(a.updated)> new Date(b.updated) ? -1:1;
        });
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
            notes.push(noteToSave);
        }


        
        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
        
    },

    deleteNote(id){
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note =>note.id != id);
        
        localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
    }

}

export default  NotesAPI;