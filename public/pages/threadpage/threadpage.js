const pathname = window.location.pathname;
const threadId = pathname.substring(17);

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
    
    const headerWrapper = document.querySelector('#header-wrapper');
    const threadWrapper = document.querySelector('#thread-wrapper');
    
    headerWrapper.insertAdjacentHTML('afterbegin', thread.title)
    
    thread.posts.reverse().map(post => {
        threadWrapper.insertAdjacentHTML('afterbegin', 
        `<div class="d-flex flex-row comment-row" >             
        <div class="comment-text w-100">
        <h6>${escapeHTML(post.username)}</h6>
        <div class="comment-footer"> <span class="date">${post.createdAt}</span> <span class="action-icons"> <a href="#" data-abc="true"><i class="fa fa-pencil"></i></a> <a href="#" data-abc="true"><i class="fa fa-heart"></i></a> </span> </div>
        <p class="m-b-5 m-t-10">${escapeHTML(post.content)}</p>
        </div>
        </div>`);

        
    })
    

})
.catch(error => {
    console.log(error); 
});




async function submitNewPost() {

    const username = await fetch('/auth/username')
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


    fetch(`/api/threads/newpost/${threadId}`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
        username: username,
        content: document.getElementById('new-post-content').value
        })
    })
    .then(res => {
        console.log(res)
        if (res.ok) {
            toastr.success('Post created')
            setTimeout(() => location.href= `/msgboard/thread/${threadId}`, 1500);
        } else {
            toastr.error('Could not create post')
        }
    })
}

document.getElementById('submit-new-post').addEventListener('click', submitNewPost)