const allUsersDiv = document.getElementById('all-users-div');
const showAllUsersBtn = document.getElementById('show-all-users-btn')
                                .addEventListener('click', () => {
                                toggleAllUsersDiv()    
                                showAllUsers();
                                }) 

      //---------------\\
     //-----TOGGLERS----\\
    //-------------------\\

function toggleAllUsersDiv() {

    allUsersDiv.hidden = !allUsersDiv.hidden;
    toggleShowAllUsersBtnText();

}

function toggleShowAllUsersBtnText(){

    allUsersDiv.hidden ?    document.getElementById('show-all-users-btn').innerHTML = 'Show All Users' :
                            document.getElementById('show-all-users-btn').innerHTML = 'Collapse User Table'; 
    
}


function toggleUpdate_DoneBtn(row){

    row.cells[1].innerHTML === '<button class="button" type="button" id="update_done-btn">Update</button>' ?
    row.cells[1].innerHTML = '<button class="button green-button" type="button" id="update_done-btn">Done</button>' :
    row.cells[1].innerHTML = '<button class="button" type="button" id="update_done-btn">Update</button>'
    // if (row.cells[1].innerHTML === '<button class="button" type="button" id="update_done-btn">Update</button>') {
    //     row.cells[1].innerHTML = '<button class="button green-button" type="button" id="update_done-btn">Done</button>';
    // } else {
    //     row.cells[1].innerHTML = '<button class="button" type="button" id="update_done-btn">Update</button>';
    // }
}

      //------------------------\\
     //-----Button Functions-----\\
    //----------------------------\\

function showAllUsers() {

    const usersTable = document.getElementById('users-wrapper');
    usersTable.innerHTML = '';

    fetch('/api/users')
    .then(res => {
        if (!res.ok){
            toastr.error('Could not fetch users from API')
        } else {
            return res.json();
        }
    })
    .then(user =>  {

        user.map(user => {

            let row = usersTable.insertRow();

            row.insertCell().innerHTML = '<button class="button" type="button">Delete</button>';
            row.insertCell().innerHTML = '<button class="button" type="button" id="update_done-btn">Update</button>';
            row.insertCell().innerHTML = `<h5>${escapeHTML(user.username)}</h5>`;
            row.insertCell().innerHTML = `<h5>${escapeHTML(user.email)}</h5>`;
            row.insertCell().innerHTML = `<h6>${user.userId}</h6>`;

            row.cells[0].onclick = () => {
                deleteUserAndRow(user.userId, row.rowIndex);
            }           

            row.cells[1].onclick = () => {
                if (row.cells[1].innerHTML === '<button class="button" type="button" id="update_done-btn">Update</button>') {
                    row.cells[2].innerHTML = `<input id="new-username" type="text" value="${escapeHTML(user.username)}"></input>`;
                    row.cells[3].innerHTML = `<input id="new-email" type="text" value="${escapeHTML(user.email)}"></input>`;
                }
                if (row.cells[1].innerHTML === '<button class="button green-button" type="button" id="update_done-btn">Done</button>') {
                    updateUser(user.userId)
                    .then(updatedUser => {
                        row.cells[2].innerHTML = `<h5>${escapeHTML(updatedUser.value.username)}</h5>`;
                        row.cells[3].innerHTML = `<h5>${escapeHTML(updatedUser.value.email)}</h5>`;
                    });
                } 
                toggleUpdate_DoneBtn(row);
            }
        })
    })
    .catch(error => {
        console.log(error);
    });
}

      //--------------------\\
     //-----CRUD  Calls------\\
    //------------------------\\



async function updateUser(userId) {

    const updatedUser = await fetch(`api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            username: escapeHTML(document.getElementById('new-username').value), 
            email: escapeHTML(document.getElementById('new-email').value)
        })
    })
    .then(res => {
        return res.json();
    })
    .then(dbResponse => {
        dbResponse.updatedExisting ? toastr.error('Could not update user') : toastr.success('User updated');
        return dbResponse;
    })
    .catch(error => {
        console.log(error);
    })
    return updatedUser
};

function deleteUserAndRow(userId, indexOfRowToDelete) {

    fetch(`/api/users/${userId}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            toastr.error('Unable to delete user')
        } 
    })
    .then(res => {
        console.log(res)
        const tableRows = document.getElementsByTagName('tr');
        const rowToDelete = Array
                                .from(tableRows)
                                .find(row => row.rowIndex === indexOfRowToDelete);
        rowToDelete.remove();
        toastr.success(`User: ${res.value.username} deleted successfully.`)
    })
    .catch(error => {
        toastr.error('Something went wrong');
        console.log(error); 

    });
}