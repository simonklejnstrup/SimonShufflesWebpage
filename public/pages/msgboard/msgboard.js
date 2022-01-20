const threadsTable = document.getElementById('threads-wrapper');

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
    
    threads.reverse().map(thread => { 

        let row = threadsTable.insertRow();

        fetch(`/api/usersByUsername/${thread.posts[0].username}`)
        .then(res => {
        if (!res.ok) {
            return { username: 'Anonymous' }
        } else {
            return res.json();
        }
        })
        .then(user => {

        const contentCell = row.insertCell();
        contentCell.classList.add('w-75', 'p-3', 'align-middle');
        contentCell.innerHTML =    `<div  class="thread-title"> 
                                        <a href="/msgboard/thread/${thread.threadId}">${escapeHTML(thread.title)}</a>
                                        <p class="date"> Postet: ${thread.posts[0].createdAt}</p>
                                    </div>
                                    ` 

        if (user.username === 'Anonymous') {
            const userInfoCell = row.insertCell()
            userInfoCell.classList.add('w-25', 'user-info', 'text-center');
            userInfoCell.innerHTML =    `<div  class="comment-text w-100">
                                                <h5 class="author">${escapeHTML(thread.posts[0].username)}</h5>
                                                <p class="mb-1"> Replies: ${thread.posts.length - 1}</p>
                                                <p> Last reply by: ${thread.posts[thread.posts.length - 1].username}</p>
                                            </div>`

            
        } else {

            const userInfoCell = row.insertCell()
            userInfoCell.classList.add('w-25', 'user-info', 'text-center');
            userInfoCell.innerHTML =    `<div  class="comment-text w-100">
                                                <h5 class="author mb-2">${escapeHTML(thread.posts[0].username)}</h5>
                                                <p class="mb-1"> Replies: ${thread.posts.length - 1}</p> 
                                                <p> Last reply by: ${thread.posts[thread.posts.length - 1].username}</p>
                                            </div>`
        }
        
        })
        .catch(error => {
            console.log(error); 
        });
    });
})

