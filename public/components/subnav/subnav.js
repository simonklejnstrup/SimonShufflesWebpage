const welcomeMsg = document.getElementById('welcome-msg');
const loggedInDiv = document.getElementById('logged-in');
const loggedOutDiv = document.getElementById('logged-out');
const adminBtn = document.getElementById('admin-btn');

fetch('/auth/username')
.then(res => {
    if (!res.ok) {
        loggedInDiv.hidden = true;
        loggedOutDiv.hidden = false;
        adminBtn.hidden = true;
    } else {
        loggedInDiv.hidden = false;
        loggedOutDiv.hidden = true;
        return res.json();
    }
})
.then(user => {
    if (!user) {
        return;
    } else {
        document
        .querySelector('#welcome-msg')
        .insertAdjacentHTML('afterbegin',
        `<h3>Welcome ${user.username}</h3>`);
    }
})


fetch('/auth/isAdmin')
.then(res => {
    return res.json();
})
.then(user => {
    user.isAdmin ? adminBtn.hidden = false : adminBtn.hidden = true;
})


function login() {
    document.querySelector('#welcome-msg').insertAdjacentHTML('afterbegin', '<h5></h5>')
    fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    })
    .then(res =>  { 
        if (!res.ok) {
            toastr.error('Could not login - Check password and try again');
        }
        else {
            toastr.success('Logging in...');
            setTimeout(() => location.href= '/msgboard', 1500);
        }
    }); 
}


document.getElementById('sign-up-btn').addEventListener('click', () => {
    location.href = '/signup';
});

document.getElementById('login-btn').addEventListener('click', login);

document.getElementById('logout-btn').addEventListener('click', () => {
    location.href = '/logout';
});

document.getElementById('admin-btn').addEventListener('click', () => {
    location.href = '/admin';
});

document.getElementById('new-thread').addEventListener('click', () => {
    location.href= '/createnewthread';
});

