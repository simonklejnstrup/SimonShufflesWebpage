function fetchThreads() {
    fetch('/api/threads')
    .then((res) => {
        if (!res.ok) {
            toastr.error('Could not fetch threads from API');
            setTimeout(() => location.href= '/msgboard', 1500);
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
                <a href="/msgboard/thread/${escapeHTML(thread.threadId)}">${escapeHTML(thread.title)}</a>
                <p> Author: ${thread.posts[0].username}</p>
                <p> Postet: ${thread.posts[0].createdAt}</p>
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
        if (!res.ok){
            toastr.error('Could not delete thread');
            setTimeout(() => location.href= '/msgboard', 1500);
        } else {
            //toastr.success("Thread deleted successfully")
            setTimeout(() => location.href= '/msgboard', 500);

        }
    })
}







document.getElementById('new-thread').addEventListener('click', () => {
    location.href= '/createnewthread';
});









