

function login() {
    document.querySelector('#welcome-msg').insertAdjacentHTML('afterbegin', '<h5></h5>')
    fetch("/msgboard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    }).then(res =>  {
        if (res.ok) {
            res.json()
            .then(user => {
                document
                .querySelector('#welcome-msg')
                .insertAdjacentHTML('afterbegin',
                `<h5>Welcome ${user.username}</h5>`);
            })

            toastr.success('Logging in...');
            toggleLoginDiv();

            setTimeout(() => location.href= '/msgboard', 1500); // TODO: Ret destination til
        }
        else {
            toastr.info("Couldn't login - Check password and try again.'")
        }
    }) 
}


document.getElementById('sign-up').addEventListener('click', () => {
    location.href= '/signup';
});

document.getElementById('login').addEventListener('click', login);

const loginDiv = document.getElementById('login-div');

function toggleLoginDiv(){
    if (loginDiv.style.display === 'none'){
        loginDiv.style.display = 'block'
    } else {
        loginDiv.style.display = 'none'
    }
}