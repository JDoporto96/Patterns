export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete, onNoteSwitch, onNoteSearch, onUndo } = {}){
        this.root=root;
        this.onNoteSelect=onNoteSelect;
        this.onNoteAdd=onNoteAdd;
        this.onNoteEdit=onNoteEdit;
        this.onNoteDelete=onNoteDelete;
        this.onNoteSearch=onNoteSearch;
        this.onNoteSwitch=onNoteSwitch;
        this.onUndo =onUndo;
        this.preview =this.root.querySelector(".notes_preview");
        this.note_title=this.root.querySelector(".note_title");
        this.note_body=this.root.querySelector(".note_body");
        this.notesListContainer = this.root.querySelector(".note_list");
        this.lnotes=this.notesListContainer.querySelectorAll(".note_item");
        this.template1 = this.root.querySelector("#temp_note_item");
        this.deleteBtn = this.root.querySelector(".delete_note");
        this.searchBar =this.root.querySelector("#search");

        const btnAddNote = this.root.querySelector(".add_note");
        const btnDeleteNote = this.root.querySelector(".delete_note");
        const undoBtn=this.root.querySelector("#undo_btn");
        const searchInput =this.root.querySelector("#search");
        const container =this.notesListContainer;
        

        btnAddNote.addEventListener("click", () =>{
            this.onNoteAdd();
        });

        undoBtn.addEventListener("click", ()=>{
            this.onUndo();
        })

        searchInput.addEventListener("input", e=>{
            const input = e.target.value.toLowerCase();
            this.onNoteSearch(input);
            
        });


        btnDeleteNote.addEventListener("click", () =>{
            const doDelete = confirm("Continue deleting this note?");

            if(doDelete){
                this.onNoteDelete();
            }

            
               
            
        });


        [this.note_title,this.note_body].forEach(field =>{
            field.addEventListener("blur", () =>{
                const updatedTitle= this.note_title.value.trim();
                const updatedBody= this.note_body.value.trim();

                this.onNoteEdit(updatedTitle,updatedBody);
            })
        })

        container.addEventListener("dragstart", e =>{
            const draggable = e.target;
            draggable.classList.add("dragging");
        
        });
        
        container.addEventListener("dragend", e =>{
            const draggable = e.target;
            draggable.classList.remove("dragging");
            const beforeElement = getDragAfterElement(container, e.clientY);
            const id1 = draggable.getAttribute("data-note-id");
            if (beforeElement ==null){
                this.onNoteSwitch(id1, null) 
            }
            else{
                const id2 = beforeElement.getAttribute("data-note-id");
                this.onNoteSwitch(id1, id2) 
            }
        })


          
        container.addEventListener("dragover",e =>{
            e.preventDefault();
            const afterElement = getDragAfterElement(container, e.clientY);
            const draggable = this.root.querySelector(".dragging");
            
            if (afterElement== null){
                container.appendChild(draggable);

            }
            else{
                container.insertBefore(draggable,afterElement)
                
            }
             
        })
    
    function getDragAfterElement(container,y){
        const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
    
        return draggableElements.reduce((closest, child) =>{
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height /2
            if (offset < 0 && offset > closest.offset){
                return{offset: offset, element:child }
            }
            else{
                return closest
            }
    
        },{offset: Number.NEGATIVE_INFINITY}).element
    }
        
        this.note_body.addEventListener('keydown', e => {
            if ( e.key === 'Tab' && !e.shiftKey ) {
                document.execCommand('insertText', false, "\t");
                e.preventDefault();
                return false;
            }
        });

        window.addEventListener('keydown', event=> {
            if (event.ctrlKey && event.key === 'z') {
              this.onUndo();
            }
          });

        this.NotePreview(false);

    }

    createListItemHTML(id,title,body,updated,creation){
        const MAX_BODY_LENGTH=60;
        var clone = this.template1.content.cloneNode(true);
        clone.querySelector(".note_item").setAttribute("data-note-id",`${id}`);
        clone.querySelector(".lnote_title").textContent = title;
        clone.querySelector(".lnote_body").textContent = body.substring(0,MAX_BODY_LENGTH) + (body.length > MAX_BODY_LENGTH ? "...":"");
        clone.querySelector(".lnote_updated").textContent = `Created on: ${creation.toLocaleString('en-us', {dateStyle :"full", timeStyle: "short"})} \n
        Last edit: ${updated.toLocaleString('en-us', {dateStyle :"full", timeStyle: "short"})}`;
            
        this.notesListContainer.appendChild(clone);
        
    }

    updateNotesList(notes){
        

        this.notesListContainer.innerHTML=" ";
        
        for(const note of notes){
            const html =this.createListItemHTML(note.id, note.title,note.body, new Date(note.updated),new Date(note.creation));

        }

        

        this.notesListContainer.addEventListener("click",(event) =>{
            let ListItem =event.target.closest(".note_item"); 
            if(ListItem){
                this.onNoteSelect(ListItem.dataset.noteId);
            }   
            

            });
    }
    updateActiveNote(note){
        this.note_title.value=note.title;
        this.note_body.value=note.body;

        this.root.querySelectorAll(".note_item").forEach(notesListItem =>{
            notesListItem.classList.remove("note_item--selected");
        });
        this.root.querySelector(`.note_item[data-note-id="${note.id}"]`).classList.add("note_item--selected");
    }

    NotePreview(visible){
        this.preview.style.visibility=visible? "visible" : "hidden";
    }
}