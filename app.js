import NotesView from "./view.js";
import NotesAPI from "./API.js";
import { CommandManager, AddNoteCommand, DeleteNoteCommand, EditNoteCommand, SwitchNoteCommand } from "./command.js";

export default class App{
    constructor(root){
        this.notes=[];
        this.activeNote=null;
        this.commandMan=new CommandManager();
        this.view= new NotesView(root,this.handlers());
        this.refreshNotes();
    }

    refreshNotes(){
        const notes = NotesAPI.getAllNotes();
        this.setNotes(notes);
        if (notes.length > 0){
            this.setActiveNote(notes[0]);
        }
        if(notes.length==0){
            const deleteBtn = this.view.deleteBtn;
            const searchBar =this.view.searchBar;
            deleteBtn.style.visibility="hidden";
            searchBar.style.visibility="hidden";
        }else{
            const deleteBtn = this.view.deleteBtn;
            const searchBar =this.view.searchBar;
            deleteBtn.style.visibility="visible";
            searchBar.style.visibility="visible";
        }
    }

    setNotes(notes){
        this.notes =notes;
        this.view.updateNotesList(notes);
        this.view.NotePreview(notes.length>0);
    }

    setActiveNote(note){
        this.activeNote=note;
        this.view.updateActiveNote(note);

    }
    handlers(){
        return{
            onNoteSelect: noteId=>{
                const selectedNote = this.notes.find(note =>note.id==noteId);
                this.setActiveNote(selectedNote);
            },

            onNoteAdd: ()=>{
                this.commandMan.executeCommand(new AddNoteCommand());
                this.refreshNotes();
            },

            onNoteEdit: ( title, body)=>{
               this.commandMan.executeCommand(new EditNoteCommand(this.activeNote),title,body);
               this.refreshNotes();
            },

            onNoteDelete: ()=>{
                this.commandMan.executeCommand(new DeleteNoteCommand(this.activeNote));
                this.refreshNotes();
            },

            onNoteSwitch: (id1, id2)=>{
                this.commandMan.executeCommand(new SwitchNoteCommand(id1,id2));
                this.refreshNotes();
            },

            onNoteSearch: (input)=>{
                let notes = NotesAPI.getAllNotes();
                notes=notes.filter(note=> note.title.toLowerCase().includes(input) || note.body.toLowerCase().includes(input));
                this.setNotes(notes);
            },

            onUndo: ()=>{
                this.commandMan.undoCommand();
                this.refreshNotes();
            }
        };
    }
}

