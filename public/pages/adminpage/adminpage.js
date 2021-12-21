const allUsersDiv = document.getElementById('all-users-div');
const showAllUsersBtn = document.getElementById('show-all-users-btn').addEventListener('click', () => {
                                                                                        toggleAllUsersDiv()    
                                                                                        showAllUsers();
                                                                                        })

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

function showAllUsers() {
    
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
        const usersTable = document.getElementById('users-wrapper'); //Alternativ: '#users-wrapper'

        user.map(user => {
            let row = usersTable.insertRow();

            row.insertCell().innerHTML = `<button">Delete</button>`;
            row.insertCell().innerHTML = `<button onclick="updateUser(${escapeHTML(user.userId)})">Update</button>`;
            row.insertCell().innerHTML = `<p>${escapeHTML(user.username)}</p>`;
            row.insertCell().innerHTML = `<p>${escapeHTML(user.email)}</p>`;
            row.insertCell().innerHTML = `<p>${escapeHTML(user.userId)}</p>`;

            row.cells[0].onclick = () => {
                const userId = user.userId
                deleteUser(user.userId, row.rowIndex)
            }

            // row.cells[1].onclick = () => {

            // }


        })
    })
    .catch(error => {
        toastr.error('Something went wrong');
        console.log(error); 

    })
}

function deleteUser(userId, indexOfRowToDelete) {
    fetch(`/api/users(${userId})`, {
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

    })
}