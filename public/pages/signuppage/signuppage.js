function createUser() {
    const password = document.getElementById('password').value; 
    const rePassword = document.getElementById('re-password').value;


    if (password !== rePassword) {
        return
    } else {
        fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            })
        })
        
        .then (res => {
            if (!res.ok){
                throw Error("Could not create user");
            } else {

                //toastr.success("Thread created successfully")
                setTimeout(() => location.href= "/msgboard", 1); //TODO: SÆT LÆNGERE TIMEOUT
            }
        })
        .catch(error => {
            console.log(error);
        });
    }
}



document.getElementById('create-user').addEventListener('click', createUser);

function sayHello() {
    console.log("Hello!");
}