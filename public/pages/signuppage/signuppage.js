function createUser() {
    const password = document.getElementById('pass').value; 
    const rePassword = document.getElementById('re-pass').value;


    if (password !== rePassword) {
        toastr.error('Please make sure passwords match')
        return
    } else {
        fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                username: escapeHTML(document.getElementById('u-name').value), 
                email: escapeHTML(document.getElementById('email').value),
                password: escapeHTML(document.getElementById('pass').value)
            })  
        })
        .then (res => {
            console.log(res.status)
            switch (res.status){
                case 201:
                    toastr.success('User created successfully')
                    setTimeout(() => location.href= "/msgboard", 1500); 
                    break;
                case 400:
                    toastr.error('Please fill all fields');
                    break;
                case 409:
                    toastr.error('Username or email already in use');
                    break;
                case 422:
                    toastr.error('Email format not accepted');
                    break;
                default:
                    toastr.error('Internal server error. Please try again');
            }
        })
        .catch(error => {
            console.log(error);
        });
    }
}



document.getElementById('create-user').addEventListener('click', createUser);

