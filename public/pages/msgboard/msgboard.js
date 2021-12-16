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
                <a href="/thread/${escapeHTML(thread.threadId)}">${escapeHTML(thread.title)}</a>
                </div>`);
        })
    })
    .catch(error => {
       console.log(error); 
    });
}

fetchThreads();



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
        if (res.ok) {
            toastr.success('Logging in...')
               setTimeout(() => location.href= '/signup', 1500); // TODO: Ret destination til
        }
        else {
            toastr.info("Couldn't login - Check password and try again.'")
        }
    }) 
}





document.getElementById('new-thread').addEventListener('click', () => {
    location.href= '/createnewthread';
});

document.getElementById('sign-up').addEventListener('click', () => {
    location.href= '/signup';
});

document.getElementById('login').addEventListener('click', login);







