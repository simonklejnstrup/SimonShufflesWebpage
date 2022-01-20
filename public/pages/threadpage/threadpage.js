const pathname = window.location.pathname;
const threadId = pathname.substring(17);
const headerWrapper = document.querySelector('#header-wrapper');
const threadWrapper = document.querySelector('#thread-wrapper');
const threadTable = document.getElementById('thread-wrapper');

const socket = io();

async function getCurrentUsername() {
    const username = await fetch('/auth/username')
                        .then(res => {

                        if (!res.ok) {
                            return { username: 'Anonymous' };
                        } else {
                            return res.json();
                            } 
                        })
                        .then(res => {
                            return res.username;
                        })
    return username;
    };

fetch(`/api/threads/${threadId}`) 
.then((res) => {
    if (!res.ok) {
        toastr.error('Could not fetch thread from API');
        setTimeout(() => location.href= '/msgboard', 1500);
    } else {
        return res.json();
    }
})
.then(thread => { 
    
    // Insert title
    headerWrapper.insertAdjacentHTML('afterbegin', thread.title);

    // Insert delete-button if user === OP
    const deleteBtn = document.getElementById('delete-btn');
    const okBtn = document.getElementById('ok-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const confirmText = document.getElementById('confirm-txt');

    getCurrentUsername().then(currentUsername => {
        currentUsername !== 'Anonymous' && currentUsername === thread.posts[0].username ? deleteBtn.hidden = false : deleteBtn.hidden = true; 
    });

    // Add eventlisteners til ok, cancel & delete buttons
    deleteBtn.addEventListener('click', () => {
        okBtn.hidden = false;
        cancelBtn.hidden = false;
        confirmText.hidden = false;
    });
    okBtn.addEventListener('click', () => {
        deleteThread();
    });
    cancelBtn.addEventListener('click', () => {
        okBtn.hidden = true;
        cancelBtn.hidden = true;
        confirmText.hidden = true;
    });
    
    thread.posts.map(post => {

        displayNewPost(post);

    });
})
.catch(error => {
    console.log(error); 
});

function deleteThread() {
    fetch(`/api/threads/${threadId}`, {
        method: 'DELETE',
    })
    .then(res => {
        if (!res.ok){
            toastr.error('Could not delete thread');
        } else {
            toastr.success("Thread deleted successfully")
            setTimeout(() => location.href= '/msgboard', 1500);

        }
    })  
}

async function submitNewPost() {

    getCurrentUsername().then(currentUsername => {
        fetch(`/api/threads/newpost/${threadId}`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
            username: currentUsername,
            content: document.getElementById('new-post-content').value
            })
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                toastr.error('Server error. Could not create post');
            }
        })
        .then(dbResponse => {
    
            newPost = dbResponse.value.posts.at(-1);
            socket.emit('new-post', newPost);
            document.getElementById('new-post-content').value = '';
        });
    });

}

async function editPost(postId, newContent) {
    
    const threadArray = await fetch('/api/threads/editpost', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            threadId: threadId,
            postId: postId, 
            newContent: newContent
        })
    })
    .then(res => {
        if (!res.ok) {
            toastr.error('Error. Failed to update post')
        } else {
            return res.json();
        }
    })
    .catch(error => {
        console.log(error);
    });

    const editedPost = threadArray.posts.find(post => post.postId === postId);
    return editedPost;
}

socket.on('new-post', newPost => {
    displayNewPost(newPost); 
});


async function displayNewPost(post) {

    let lastUpdatedAtMsg = '';

    let row = threadTable.insertRow();

    fetch(`/api/usersByUsername/${post.username}`)
    .then(res => {
        if (!res.ok) {
            return { username: 'Anonymous' }
        } else {
            return res.json();
        }
    })
    .then(user => {

        if (user.username === 'Anonymous') {
            const userInfoCell = row.insertCell()
            userInfoCell.classList.add('w-25', 'user-info', 'text-center');
            userInfoCell.innerHTML =    `<div  class="comment-text w-100">
                                                <h5 class="author">${escapeHTML(post.username)}</h5>
                                            </div>`

            const contentCell = row.insertCell();
            contentCell.classList.add('w-75', 'p-3');
            contentCell.innerHTML =    `<div id="comment-footer" class="comment-footer"> 
                                                <p class="date">${post.createdAt}</p>
                                                <p id="post-content" class="m-b-5 m-t-10">${escapeHTML(post.content)}</p>
                                                </div>
                                            ` 
        } else {

            const userInfoCell = row.insertCell()
            userInfoCell.classList.add('w-25', 'user-info', 'text-center');
            userInfoCell.innerHTML =    `<div  class="comment-text w-100">
                                                <h5 class="author mb-2">${escapeHTML(post.username)}</h5>
                                                <p class="date mb-1">Joined: ${user.joinedAt}</p> 
                                                <p class="date">Postcount: ${user.postCount}</p>
                                            </div>`
            if (post.lastUpdatedAt) {
                lastUpdatedAtMsg = `<p class="last-updated-at mt-4">Last updated: ${post.lastUpdatedAt}</p>`
            }
        
        
            const contentCell = row.insertCell();
            contentCell.classList.add('w-75', 'p-3');
            contentCell.innerHTML =    `<div id="comment-footer" class="comment-footer"> 
                                                <p class="date">${post.createdAt}</p>
                                                <p id="post-content" class="m-b-5 m-t-10">${escapeHTML(post.content)}</p>
                                                </div>
                                                ${lastUpdatedAtMsg}
                                            ` 
        }
    

    getCurrentUsername().then(currentUsername => {

    if (currentUsername !== 'Anonymous' && currentUsername === post.username) {
        const editCell = row.insertCell();
        editCell.classList.add('w-75', 'p-3');
        editCell.innerHTML = '<button class="button pull-right">Edit</button>';
        editCell.onclick = executeEditPostFunction;
    }

    let currentStateOfPost = replaceFixedPostWithTextarea;

    function executeEditPostFunction() {
        currentStateOfPost();
    };

    function replaceFixedPostWithTextarea() {
        currentStateOfPost = replaceTextareaWithFixedPost;
        row.cells[1].innerHTML = `<textarea id="edited-post" style="resize: none" cols="60" rows="10" class="m-b-5 m-t-10">${escapeHTML(post.content)}</textarea>`;
        row.cells[2].innerHTML = '<button class="button green-button pull-right">Done</button>';
        
    };

    async function replaceTextareaWithFixedPost() {
        currentStateOfPost = replaceFixedPostWithTextarea;

        const editedPost = document.getElementById('edited-post').value;

        await editPost(post.postId, editedPost)
                .then(editedPost => {
                    if (editedPost.isEmpty) {
                        toastr.error('An error has occured. Unable to update post');
                        return;
                    } else {
                        row.cells[1].innerHTML =    `<div id="comment-footer" class="comment-footer"> 
                                                        <p id="post-content" class="m-b-5 m-t-10">${escapeHTML(editedPost.content)}</p>
                                                    </div>
                                                    <p class="last-updated-at mt-4">Last updated: ${editedPost.lastUpdatedAt}</p>`;
                        row.cells[2].innerHTML = '<button class="button pull-right">Edit</button>';
                    }})
                .catch(error => {
                console.log(error)
                }); 
    };
    })  
}

)}

document.getElementById('submit-new-post').addEventListener('click', submitNewPost);

