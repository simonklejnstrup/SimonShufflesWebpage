/**************************************************************************************************
---------GLOBAL VARIABLES---------GLOBAL VARIABLES---------GLOBAL VARIABLES---------GLOBAL VARIABLES
**************************************************************************************************/

const allUsersDiv = document.getElementById('all-users-div');
const showAllUsersBtn = document.getElementById('show-all-users-btn')
                                .addEventListener('click', () => {
                                toggleAllUsersDiv()    
                                showAllUsers();
                                }) 


/**************************************************************************************************
---------FUNCTIONS---------FUNCTIONS---------FUNCTIONS---------FUNCTIONS---------FUNCTIONS---------
**************************************************************************************************/



      //---------------\\
     //-----TOGGLERS-----\\
    //-------------------\\

function toggleAllUsersDiv() {

    if (allUsersDiv.hidden) {
        allUsersDiv.hidden = false;
        toggleShowAllUsersBtnText();
    } else {
        allUsersDiv.hidden = true
        toggleShowAllUsersBtnText();
    }
}

function toggleShowAllUsersBtnText(){

    if (allUsersDiv.hidden) {
        document.getElementById('show-all-users-btn').innerHTML = 'Show All Users';
    } else {
        document.getElementById('show-all-users-btn').innerHTML = 'Collapse User Table';
    }
}

function toggleUserNameAndEmailDisplay(row, user){

    const update_DoneBtn = document.getElementById('update_done-btn'); 

    if (update_DoneBtn.innerHTML === 'Done') {       
    row.cells[2].innerHTML = `<input id="new-username" type="text" value="${escapeHTML(user.username)}"></input>`;
    row.cells[3].innerHTML = `<input id="new-email" type="text" value="${escapeHTML(user.email)}"></input>`;
    } else {
        row.cells[2].innerHTML = `<p>${escapeHTML(user.username)}</p>`;
        row.cells[3].innerHTML = `<p>${escapeHTML(user.email)}</p>`;
    }
}

function toggleUpdate_DoneBtn(){

    const update_DoneBtn = document.getElementById('update_done-btn'); 
    
    if (update_DoneBtn.innerHTML === 'Done' || update_DoneBtn.innerHTML === 'undefined') { 
        update_DoneBtn.innerHTML = 'Update';
    } else {
        update_DoneBtn.innerHTML = 'Done';
    }
}

      //------------------------\\
     //-----Button Functions-----\\
    //----------------------------\\

function showAllUsers() {

    const usersTable = document.getElementById('users-wrapper'); 
    usersTable.innerHTML = '';

    fetch('/api/users', {
        method: 'GET'
    })
    .then(res => {
        if (!res.ok){
            throw Error('Could not fetch users from API');
        } else {
            return res.json();
        }
    })
    .then(user =>  {

        user.map(user => {

            let row = usersTable.insertRow();

            row.insertCell().innerHTML = `<button type="button">Delete</button>`;
            row.insertCell().innerHTML = `<button id="update_done-btn">Update</button>`;
            row.insertCell().innerHTML = `<p>${escapeHTML(user.username)}</p>`;
            row.insertCell().innerHTML = `<p>${escapeHTML(user.email)}</p>`;
            row.insertCell().innerHTML = `<p>${escapeHTML(user.userId)}</p>`;

            row.cells[0].onclick = () => {

                deleteUserAndRow(user.userId, row.rowIndex);

            }           

            row.cells[1].onclick = () => {

                const update_DoneBtn = document.getElementById('update_done-btn'); 

                toggleUpdate_DoneBtn();

                toggleUserNameAndEmailDisplay(row, user);

                
                if (update_DoneBtn.innerHTML === 'Update') {

                    //TODO:
                    const newUsername = document.getElementById('new-username').value; // TypeError: document.getElementById(...) is null
                    const newEmail = document.getElementById('new-email').value; // TypeError: document.getElementById(...) is null

                    updateUser(user.userId, newUsername, newEmail);
                }
            }
        })
    })
    .catch(error => {
        toastr.error('Something went wrong');
    });
}

      //--------------------\\
     //-----Fetch Calls------\\
    //------------------------\\



function updateUser(userId, newUsername, newEmail) {
    console.log('linje 135');
    fetch(`api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            username: escapeHTML(newUsername), 
            email: escapeHTML(newEmail)
        })
    })
    .then(res => {
        if (res.ok) {
            toastr.success('User updated');
            toggleUserNameAndEmailDisplay();
        } else {
            toastr.error('Could not update user');
        }
    })
    .catch(error => {
        console.log(error);
    })
};

function deleteUserAndRow(userId, indexOfRowToDelete) {
    fetch(`/api/users/${userId}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (res.ok) {
            res.json();
            const tableRows = document.getElementsByTagName('tr');
            const rowToDelete = Array
                                    .from(tableRows)
                                    .find(row => row.rowIndex === indexOfRowToDelete);
            rowToDelete.remove();
            toastr.success(`User: ${res.username} deleted successfully.`)
        } else {
            toastr.error('Unable to delete user')
        }
    })
    .catch(error => {
        toastr.error('Something went wrong');
        console.log(error); 

    });
}