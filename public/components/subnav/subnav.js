const welcomeMsg = document.getElementById('welcome-msg');
const loggedInDiv = document.getElementById('logged-in');
const loggedOutDiv = document.getElementById('logged-out');
const adminBtn = document.getElementById('admin-btn');


fetch('/hasSession', {
    method: "GET"
})
.then(res => {
    if (res.ok) {
        loggedInDiv.hidden = false;
        loggedOutDiv.hidden= true;
        res.json()
            .then(user => {
                document
                .querySelector('#welcome-msg')
                .insertAdjacentHTML('afterbegin',
                `<h5>Welcome ${user.username}</h5>`);
                if (user.username === 'admin'){
                    adminBtn.hidden = false;
                }
            })
    } else {
        loggedInDiv.hidden = true;
        loggedOutDiv.hidden = false;
        adminBtn.hidden = true;

    }
})

function login() {
    document.querySelector('#welcome-msg').insertAdjacentHTML('afterbegin', '<h5></h5>')
    fetch("/login", {
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
            res.json()
            .then(user => {
                document
                .querySelector('#welcome-msg')
                .insertAdjacentHTML('afterbegin',
                `<h5>Welcome ${user.username}</h5>`);
            })
            toastr.success('Logging in...');
            setTimeout(() => location.href= '/msgboard', 1500);
        }
    }) 
}

function toggleLoginDiv(){
    if (loggedIn.style.display === 'block'){
        loggedIn.style.display = 'none'
        loggedOut.style.display = 'block'
    } else {
        loggedIn.style.display = 'block'
        loggedOut.style.display = 'none'

    }
}




document.getElementById('sign-up-btn').addEventListener('click', () => {
    location.href = '/signup';
});

document.getElementById('login-btn').addEventListener('click', login);

document.getElementById('logout-btn').addEventListener('click', () => {
    location.href = '/logout';
})

document.getElementById('admin-btn').addEventListener('click', () => {
    location.href = '/admin';
})

