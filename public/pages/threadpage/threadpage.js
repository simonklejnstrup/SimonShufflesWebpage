const pathname = window.location.pathname;
const threadId = pathname.substring(8);

function fetchThread() {
    fetch(`/api/threads/${threadId}`) // TODO: FIX
    .then((res) => {
        if (!res.ok) {
            throw Error("Could not fetch thread from API");
        } else {
            return res.json();
        }
    })
    .then(thread => { 
        console.log(thread);
        document
        .querySelector('#thread-wrapper')
        .insertAdjacentHTML('afterbegin', 
            `<div class="thread-title">
            <h3>${escapeHTML(thread.title)}</h3>
            </div>
            <div class="thread-content">
            <p>${escapeHTML(thread.msg)}</p>
            </div>`);
    
    })
    .catch(error => {
       console.log(error); 
    });
}

fetchThread();