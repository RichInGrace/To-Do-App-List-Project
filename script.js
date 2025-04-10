// Declares a function named popup that creates and displays a popup window.

function popup() {                                                                //This function will be called when you want to show the popup (e.g., from a button click).                                                
    // Creates a new <div> element in memory (not yet visible on the page)
    const popupContainer = document.createElement("div");                        //const popupContainer → Stores the div in a variable for later use.  document.createElement("div") → Creates an empty <div>. 
    // popupContainer.innerHTML means Sets or updates the HTML content inside the popupContainer <div>.
    /*innerHTML → Inserts HTML.  This  ` ` called  backticks → Easier way to write long HTML strings.
    A container <div id="popupContainer"> (for styling/positioning).  A heading <h1> ("New Note").
    A <textarea> for user input (with placeholder text). A button container (#btn-container) with two buttons:
                                                         1. "Create Note" → Calls createNote() when clicked (assumes this function exists elsewhere)
                                                         2. "Close" → Calls closePopup() when clicked (assumes this function exists elsewhere).
    document.body.appendChild(popupContainer); What it does: Attaches the popup <div> (with all its content) to the end of the <body>.
                                               Result: The popup becomes visible on the page.    */
    popupContainer.innerHTML = `                                                 
    <div id="popupContainer">
        <h1>New Note</h1>
        <textarea id="note-text" placeholder="Enter your note..."></textarea>
        <div id="btn-container">
            <button id="submitBtn" onclick="createNote()">Create Note</button>
            <button id="closeBtn" onclick="closePopup()">Close</button>
        </div>
    </div>
    `;
    document.body.appendChild(popupContainer);
}

//Removes the popup created by popup() from the screen. 
function closePopup() {                                                        //When called: Typically triggered by clicking the "Close" button in your popup. What it does: Removes the popup from the webpage.
    const popupContainer = document.getElementById("popupContainer");          //document.getElementById("popupContainer") → Searches for an element with id="popupContainer".   const popupContainer → Stores the found element in a variable. Key Point: Returns null if the element doesn’t exist.
    if(popupContainer) {                                                          // Checks if the popup container exists before trying to remove it. How it works:  If popupContainer exists (truthy), the code inside { } runs.
        popupContainer.remove();                                              //Deletes the popup container (and all its child elements) from the DOM. DOM stands for Document Object Model.
    }
}
//Saves/processes the user's note text from the popup's <textarea> (typically stores it or displays it elsewhere).
function createNote() {                                                              //Declares a function to create and save a new note
    const popupContainer = document.getElementById('popupContainer');              //Finds the popup container element in the HTML. Why? Needed later to remove the popup after saving.
    const noteText = document.getElementById('note-text').value;                 //Gets the text entered in the <textarea> (ID: note-text). Stores: The note content in noteText.
    if (noteText.trim() !== '') {                                                  //Checks: If the note text isn't just empty spaces. Why? Prevents saving blank notes. trim() removes whitespace from both ends.
        const note = {                                                           //Creates: A note object with: 
        id: new Date().getTime(),                                                    //id: Unique timestamp (milliseconds since 1970).
        text: noteText                                                               //text: The user's input from noteText.
        };
        //Fetches or get saved notes from localStorage (browser storage). JSON.parse() converts the string back to an array. || [] provides an empty array if no notes exist yet.
        const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
        existingNotes.push(note);                                                     //Action: Adds the new note to the existingNotes array.

        localStorage.setItem('notes', JSON.stringify(existingNotes));               //Action: Saves the updated array back to localStorage. JSON.stringify(): Converts the array to a string (required for localStorage).

        document.getElementById('note-text').value = '';                           //Action: Clears the textarea for the next note.

        popupContainer.remove();                                                  //Action: Removes the popup from the page (closes it).
        displayNotes();                                                       //Assumption: Calls a separate function to refresh the displayed notes list. Purpose: Updates the UI to show the newly added note. UI stands for User Interface.
    }
}

//Shows saved notes on the webpage by updating the HTML.
function displayNotes() {                                                       //Purpose: Declares a function to display all saved notes from localStorage.
    const notesList = document.getElementById('notes-list');                   //Action: Finds the HTML element (likely a <ul> or <ol>) where notes will be displayed. Assumes: There's an element with id="notes-list" in your HTML.
    notesList.innerHTML = '';                                                 //Action: Clears all existing content inside the notes list. Why? Prevents duplicate notes when refreshing the display.
    const notes = JSON.parse(localStorage.getItem('notes')) || [];          //Retrieves saved notes from localStorage. JSON.parse() converts the string from localStorage back to a JavaScript array. || [] provides an empty array if no notes exist (fallback).

    notes.forEach(note => {                                                   //Purpose: Loops through each note in the notes array.
        const listItem = document.createElement('li');                       //Action: Creates a new <li> (list item) element for the current note.
        //Action: Sets the HTML content of the <li> to:
        //<span>${note.text}</span>   means  Displays the note text.   ${note.text} inserts the note's text dynamically.
        //${note.id} passes the note's unique ID to editNote() and deleteNote().
        // <i class="fa-solid fa-pen"></i>  means  Edit icon (Font Awesome)
        //<i class="fa-solid fa-trash"></i>   means  Delete icon 
        listItem.innerHTML = `                                               
        <span>${note.text}</span>
        <div id="noteBtns-container">
            <button id="editBtn" onclick="editNote(${note.id})"><i class="fa-solid fa-pen"></i></button>
            <button id="deleteBtn" onclick="deleteNote(${note.id})"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;
        notesList.appendChild(listItem);                                   //Action: Adds the newly created <li> to the notes list (notesList).
    });
}

//Edits an existing note identified by noteId.
function editNote(noteId) {                                                        // Declares a function to edit an existing note by its ID. Parameter: noteId - The unique ID of the note to edit.
    const notes = JSON.parse(localStorage.getItem('notes')) || [];                    //Action: Retrieves all notes from localStorage.
    const noteToEdit = notes.find(note => note.id == noteId);                   //Action: Finds the note with a matching id in the notes array. Method: Uses Array.find() to search for the note where note.id == noteId. Result: Returns the note object or undefined if not found.
    const noteText = noteToEdit ? noteToEdit.text : '';                            //If noteToEdit exists (?), use noteToEdit.text. Otherwise (:), default to an empty string (''). Purpose: Safely extracts the note's text for editing (avoids errors if note is missing).
    const editingPopup = document.createElement("div");                          //Action: Creates a new <div> element in memory (not yet visible on the page). Why? This will contain the editing interface.
    
    //Action: Populates the <div> with HTML for the edit popup:
    /* data-note-id="${noteId}": Stores the note ID in the HTML (for reference in updateNote()). 
       ${noteText}: Pre-fills the <textarea> with the note's current text.
       Buttons trigger updateNote() (saves changes) and closeEditPopup() (closes without saving).  */
    editingPopup.innerHTML = `                                             
    <div id="editing-container" data-note-id="${noteId}">
        <h1>Edit Note</h1>
        <textarea id="note-text">${noteText}</textarea>
        <div id="btn-container">
            <button id="submitBtn" onclick="updateNote()">Done</button>
            <button id="closeBtn" onclick="closeEditPopup()">Cancel</button>
        </div>
    </div>
    `;

    document.body.appendChild(editingPopup);                                        //Action: Attaches the popup to the <body> (makes it visible on the page).
}

//Purpose: Closes the "Edit Note" popup and cleans up the DOM. 
//DOM stands for Document Object Model. What It Is: A programming interface for HTML/XML documents that represents the page as a tree of objects, allowing JavaScript to access, modify, or delete elements and content.
function closeEditPopup() {                                                         // Declares a function to close the note-editing popup. Trigger: Called when the "Cancel" button in the edit popup is clicked.
    const editingPopup = document.getElementById("editing-container");              //Action: Finds the edit popup container in the DOM using its ID (editing-container). Returns null if the element doesn't exist.

    if(editingPopup) {                                                            //Check: Verifies if the popup exists before attempting to remove it. Why? Prevents errors if the popup is already closed or missing.

        editingPopup.remove();                                                    //Action: Removes the popup (and all its child elements) from the DOM. Effect: The edit interface disappears from the screen.
    }
}
//Saves changes to an edited note (usually triggered after editing text in a popup).
function updateNote() {                                                                //Purpose: Defines a function to update an existing note in localStorage.                                                
    const noteText = document.getElementById('note-text').value.trim();             //Gets the edited text from a <textarea> with ID note-text. .trim() removes whitespace from both ends (ensures empty input fails validation).
    const editingPopup = document.getElementById('editing-container');             //Finds the edit popup container (assumed to have ID editing-container). This popup holds the note being edited.

    if (noteText !== '') {                                                             //Purpose: Checks if the edited text is not empty. Why? Ensures we don't save blank notes. noteText comes from the <textarea> in the edit popup. 
        const noteId = editingPopup.getAttribute('data-note-id');                    //When the edit popup opens, it stores the note's ID in a data-note-id attribute (set earlier in editNote()). Why needed? To identify which note to update in the array.
        let notes = JSON.parse(localStorage.getItem('notes')) || [];               //Retrieves all notes from localStorage (parsed from JSON). Falls back to an empty array [] if no notes exist (|| [] is a safety check).
        
        //Creates a new array where the edited note is updated.
        const updatedNotes = notes.map(note => {                                   //How map() works: 1. Loops through each note in the notes array. 
            if (note.id == noteId) {                                               //  2. For each note, checks if its id matches the noteId being edited.                                      
                return { id: note.id, text: noteText };                            // 3. If matched: Returns a new object with the same ID but updated text (noteText).                                                  
            }
            return note;   //Leave other notes unchanged                          // 4. If not matched: Returns the note unchanged.
        });

        localStorage.setItem('notes', JSON.stringify(updatedNotes));               //Saves the updated notes array back to localStorage (converted to JSON).

        editingPopup.remove();                                                    //Purpose: Removes the edit popup from the DOM after saving.

        displayNotes();                                                         //Purpose: Refreshes the UI to show the updated notes list (assumes displayNotes() exists). UI Stands for "User Interface".
    }
}

/*************************************************************************
 * Delete Note Logic
 **************************************************************************/

//Deletes a note by its noteId from localStorage and refreshes the UI.
//Why It’s Paired with updateNote(): Both manage the same notes array in localStorage. Both call displayNotes() to sync the UI.
// TL;DR: Deletes a note. Works with updateNote() for full CRUD functionality. ✅  TL;DR means (Too Long; Didn't Read) 
/*CRUD stands for the 4 basic operations for managing data in apps:
Create (Add new data)
Read (Fetch/display data)
Update (Edit existing data)
Delete (Remove data)     */
function deleteNote(noteId) {      
    //Retrieves all notes from localStorage (browser storage).                     // Declares a function to delete a note by its ID.
    let notes = JSON.parse(localStorage.getItem('notes')) || [];                // let declares a mutable (changeable) variable named notes. Unlike const, you can reassign let variables later.
    notes = notes.filter(note => note.id !== noteId);                            // Uses Array.filter() to create a new array excluding the note with note.id === noteId. Result: notes now contains all notes except the deleted one.

    localStorage.setItem('notes', JSON.stringify(notes));                        //Saves the updated notes array back to localStorage. JSON.stringify() converts the array to a string (required for storage).
    displayNotes();                                                             //Calls a function (assumed to exist) to refresh the UI and show the updated list of notes.
}

displayNotes();                                                              //Calls displayNotes(); (Outside the function)  when the script loads to show all existing notes.
