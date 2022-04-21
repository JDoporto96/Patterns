export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete, onNoteSearch, onUndo } = {}){
        this.root=root;
        this.onNoteSelect=onNoteSelect;
        this.onNoteAdd=onNoteAdd;
        this.onNoteEdit=onNoteEdit;
        this.onNoteDelete=onNoteDelete;
        this.onNoteSearch=onNoteSearch;
        this.onUndo =onUndo;
        this.root.innerHTML=`
            <div class="notes_sidebar">
                <button class="add_note" type="button">Add note</button>
                <div class="search-wrapper">  
                    <label for="search" > </label>
                    <input type="search" placeholder="Search..." id="search" data-search>
                    <button id="undo_btn" type="button"> undo </button>
                </div>
               

                <div class="note_list"> </div>
                <button class="delete_note" type="button">Delete note</button>
            </div>
            <div class="notes_preview">
                <input class="note_title" type="text" placeholder="New note">
                <textarea class="note_body" placeholder="Enter your text here"></textarea>
                
            </div>
            `;
        this.preview =this.root.querySelector(".notes_preview");
        this.note_title=this.root.querySelector(".note_title");
        this.note_body=this.root.querySelector(".note_body");
        this.notesListContainer = this.root.querySelector(".note_list");
        this.lnotes=this.notesListContainer.querySelectorAll(".note_item");
        
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

        return `
        <div class="note_item draggable" draggable="true" data-note-id="${id}">
            <div class="lnote_title">${title}</div>
            <div class="lnote_body">
            ${body.substring(0,MAX_BODY_LENGTH)}
            ${body.length > MAX_BODY_LENGTH ? "...":""}
            </div>
            <div class="lnote_updated">Created on: ${creation.toLocaleString('en-us', {dateStyle :"full", timeStyle: "short"})}
            </div>
            <div class="lnote_updated">
            Last edit: ${updated.toLocaleString('en-us', {dateStyle :"full", timeStyle: "short"})}
            </div>
        </div>
        `;
    }

    updateNotesList(notes){
        

        this.notesListContainer.innerHTML=" ";
        
        for(const note of notes){
            const html =this.createListItemHTML(note.id, note.title,note.body, new Date(note.updated),new Date(note.creation));

            this.notesListContainer.insertAdjacentHTML("beforeend", html);
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