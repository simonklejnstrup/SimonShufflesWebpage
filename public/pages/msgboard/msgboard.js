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
            <!-- <button onclick="deleteThread('${escapeHTML(thread.threadId)}')" id="delete-thread">Delete</button> -->    
                
                <a href="/msgboard/thread/${thread.threadId
                }">${escapeHTML(thread.title)}</a>
                <p class="author"> Author: ${thread.posts[0].username}</p>
                <span class="date"> Postet: ${thread.posts[0].createdAt}</span>
                <hr>
                </div>`);
        })
        document
            .querySelector('#threads-wrapper')
            .insertAdjacentHTML('afterbegin', '<hr>')
    })
    .catch(error => {
       console.log(error); 
    });
}

fetchThreads();





















