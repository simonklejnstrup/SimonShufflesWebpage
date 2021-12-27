let user = {};

function validateUser() {

    return fetch('/hasSession')
    .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            return false;
        }
    })
    .then(user => {
        return user;
    })
    .catch(error => {
        console.log(error);
    })
}

(async () => {
    
    const anonymousUserMsg = document.getElementById('anonymous-user-msg');

    await validateUser().then(_user => {
        user = _user;
        if (!user) { 
            anonymousUserMsg.innerHTML = 'You are creating a new thread as a anonymous user. Please consider creating a user instead.';
        }
    })

})();





async function createThread() {
    //TODO: Brug validateUser() til at sende null eller user med som afsender på den nye tråd
    
    fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            title: document.getElementById('title').value,
            msg: document.getElementById('msg').value,
            user: user
        })
    })
    .then (res => {
        if (!res.ok) {
            toastr.error('Could not create thread');
        } else {
            toastr.success('Thread created successfully');
            setTimeout(() => location.href= '/msgboard', 1500);
        }
    })
    .catch(error => {
        console.log(error);
    });
}

document.getElementById('create-thread').addEventListener('click', createThread);

