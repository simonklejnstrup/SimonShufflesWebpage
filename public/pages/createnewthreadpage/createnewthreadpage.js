// Sætter en notits øverst på siden hvis bruger ikke er logged in
(async () => {
    
    const anonymousUserMsg = document.getElementById('anonymous-user-msg');

    await getUsername()
    .then(username => {
        if (username == 'Anonymous') { 
            anonymousUserMsg.innerHTML = 'You are creating a new thread as a anonymous user. Please consider creating a user instead.';
        }
    })
    

})();

async function getUsername() {

    return await fetch('/auth/username')
                    .then(res => {
                        if (!res.ok) {
                            return { username: 'Anonymous' }
                        } else {
                            return res.json() 
                        } 
                    })
                    .then(res => {
                        return res.username
                    });
}

async function createThread() {
    const currentUsername = await getUsername()
                                    .then( username => {
                                        return username
                                    })
     
    fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            title: document.getElementById('title').value, 
            content: document.getElementById('msg').value,
            user: currentUsername    
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

