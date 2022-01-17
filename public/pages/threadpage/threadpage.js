const pathname = window.location.pathname;
const threadId = pathname.substring(17);
const headerWrapper = document.querySelector('#header-wrapper');
const threadWrapper = document.querySelector('#thread-wrapper');

const socket = io();

fetch(`/api/threads/${threadId}`) 
.then((res) => {
    if (!res.ok) {
        console.log(res)
        toastr.error('Could not fetch thread from API');
        setTimeout(() => location.href= '/msgboard', 1500);
    } else {
        return res.json();
    }
})
.then(thread => { 
    
    headerWrapper.insertAdjacentHTML('afterbegin', thread.title);
    
    thread.posts.map(post => {

        displayNewPost(post);

        // threadWrapper.insertAdjacentHTML('afterbegin', 
        // `<div class="d-flex flex-row comment-row" >             
        // <div class="comment-text w-100">
        // <p class="author">${escapeHTML(post.username)}</p>
        // <div class="comment-footer"> 
        // <span class="date">${post.createdAt}</span> 
        // <span class="action-icons text-center"> <img onclick=editPost(${post.postId}) class="pencil" alt="pencil" src="../../assets/pencil.png"> </span>
        // <p class="m-b-5 m-t-10">${escapeHTML(post.content)}</p>
        // </div>
        // </div>`);
    });
})
.catch(error => {
    console.log(error); 
});

async function submitNewPost() {

    const username = await fetch('/auth/username')
                        .then(res => {
                            
                            if (!res.ok) {
                                return { username: 'Anonymous' };
                            } else {
                                return res.json();
                            } 
                        })
                        .then(res => {
                            console.log(res.username)
                            return res.username;
                        });

    fetch(`/api/threads/newpost/${threadId}`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
        username: username,
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

        socket.emit('new post', newPost)
    });
}

async function editPost(threadId, postId, newContent) {
    
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

socket.on('new post', function(newPost) {
    displayNewPost(newPost); 
});


function displayNewPost(post) {

    const commentOuterContainer = document.createElement('div');
        const commentInnerContainer = document.createElement('div');
        const authorText = document.createElement('p');
        const commentFooter = document.createElement('div');
        const createdAt = document.createElement('span');
        const actionIcons = document.createElement('span');
        const pencilImage = document.createElement('img');
        const postContent = document.createElement('p');

        //ADD CLASSES, INNERHTML AND EVENTLISTENER

        commentOuterContainer.classList.add('d-flex', 'flex-row', 'comment-row');
        commentInnerContainer.classList.add('comment-text', 'w-100');

        authorText.className = 'author';
        authorText.innerHTML = escapeHTML(post.username);

        commentFooter.className = 'comment-footer';

        createdAt.className = 'date';
        createdAt.innerHTML = post.createdAt;

        actionIcons.classList.add('action-icons', 'text-center') ;

        pencilImage.alt = 'pencil';
        pencilImage.className = 'pencil';
        pencilImage.src = '../../assets/pencil.png';
        pencilImage.addEventListener('click', () => {

            
            //Create new textarea for inputting edited message
            const editInput = document.createElement('textarea');
            editInput.name = 'edit-input';
            editInput.id = 'edit-input';
            editInput.cols = 60;
            editInput.rows = 10;
            editInput.style = 'resize: none'
            editInput.value = post.content;
            
            //Create container for editInput
            const editInputContainer = document.createElement('span');

            //Create button for completion
            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.id = 'submit';
            submitButton.innerHTML = 'Done';
            submitButton.addEventListener('click', async () => {
                await editPost(threadId, post.postId, editInput.value)
                        .then(editedPost => {
                            if (editedPost.isEmpty) {
                                toastr.error('An error has occured. Unable to update post');
                                return;
                            } else {
                                postContentFromDOM.innerHTML = escapeHTML(editedPost.content);
                                commentFooter.removeChild(submitButton);
                                editInputContainer.replaceWith(postContentFromDOM);
                            }})
                        .catch(error => {
                        console.log("TCL: error", error)
                        });        
            });

            editInputContainer.appendChild(editInput);
            
            commentFooter.appendChild(submitButton);

            const postContentFromDOM = document.getElementById('post-content');

            postContentFromDOM.replaceWith(editInputContainer);

        })

        postContent.classList.add('m-b-5', 'm-t-10');
        postContent.id = 'post-content';
        postContent.innerHTML = escapeHTML(post.content);

        // APPEND

        actionIcons.appendChild(pencilImage);

        commentFooter.appendChild(createdAt);
        commentFooter.appendChild(actionIcons);
        commentFooter.appendChild(postContent);

        commentInnerContainer.appendChild(authorText);
        commentInnerContainer.appendChild(commentFooter);

        commentOuterContainer.appendChild(commentInnerContainer);

        threadWrapper.appendChild(commentOuterContainer)
}

document.getElementById('submit-new-post').addEventListener('click', submitNewPost);

