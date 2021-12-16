function fetchThreads() {
    fetch('/api/threads')
    .then((res) => {
        if (!res.ok) {
            throw Error("Could not fetch threads from API");
        } else {
            return res.json();
        }
    })
    .then(threads => { 
        threads.map(thread => {
            document
            .querySelector('#threads-wrapper')
            .insertAdjacentHTML('afterbegin', 
            `<div class="thread">
                <button onclick="deleteThread('${escapeHTML(thread.threadId)}')" id="delete-thread">Delete</button>
                Title: ${escapeHTML(thread.title)}, 
                Msg: ${escapeHTML(thread.msg)}
                </div>`);
        })
    })
    .catch(error => {
       console.log(error); 
    });
}

fetchThreads();

function createThread() {
    fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            title: document.getElementById('title').value,
            msg: document.getElementById('msg').value
        })
    })
    .then (res => {
        if (!res.ok){
            throw Error('Could not create thread');
        } else {

            //toastr.success("Thread created successfully")
            setTimeout(() => location.href= '/msgboard', 1); //TODO: SÆT LÆNGERE TIMEOUT
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function deleteThread(threadId) {
    fetch(`/api/threads/${threadId}`, {
        method: 'DELETE',
    })
    .then(res => {
        console.log(res)
        if (!res.ok){
            throw Error('Could not delete thread');
        } else {
            //toastr.success("Thread deleted successfully")
            setTimeout(() => location.href= '/msgboard', 1500);

        }
    })
}

function login() {
    fetch("/msgboard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    }).then(res => {
        console.log(res.JSON);
        if (res.ok) {
            toastr.success('Logging in...')
            
            // if (res.text === 'admin') {
            //     setTimeout(() => location.href= '/admin', 1500);
            //     } else {
            //     setTimeout(() => location.href= '/signup', 1500); // TODO: Ret destination til
            // }
        }
        else {
            toastr.info("Couldn't login - Check password and try again.'")
        }
    }) 
}





document.getElementById('create-thread').addEventListener('click', createThread);

document.getElementById('sign-up').addEventListener('click', () => {
    location.href= '/signup';
});

document.getElementById('login').addEventListener('click', login);





