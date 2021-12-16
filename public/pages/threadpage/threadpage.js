import { threadId } from "../routers/pagesRouter.js";

console.log(threadId);

function fetchThread() {
    fetch(`'/api/threads/${threadId}'`) // TODO: FIX
    .then((res) => {
        if (!res.ok) {
            throw Error("Could not fetch threads from API");
        } else {
            return res.json();
        }
    })
    .then(thread => { 
    
        document
        .querySelector('#thread-wrapper')
        .insertAdjacentHTML('afterbegin', 
            `<div class="thread-title">
            <h3>${escapeHTML(thread.title)}</h3>
            </div>
            <div class="thread-content">
            <p>${escapeHTML(thread.title)}</p>
            </div>`);
    
    })
    .catch(error => {
       console.log(error); 
    });
}

fetchThread();