

function createThread() {
    fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            title: document.getElementById('title').value,
            msg: document.getElementById('msg').value,
        })
    })
    .then (res => {
        if (!res.ok){
            toastr.error('Could not create thread')
        } else {
            toastr.success('Thread created successfully')
            setTimeout(() => location.href= '/msgboard', 1500);
        }
    })
    .catch(error => {
        console.log(error);
    });
}

document.getElementById('create-thread').addEventListener('click', createThread);

