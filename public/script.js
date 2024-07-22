document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded'); // Отладка

    document.getElementById('signInBtn').addEventListener('click', () => {
        window.location.href = 'sign-in.html';
    });

    document.getElementById('generateKeyBtn').addEventListener('click', () => {
        alert('Key generation functionality will be implemented here.');
    });

    document.getElementById('documentationBtn').addEventListener('click', () => {
        document.getElementById('documentationSection').style.display = 'block';
        document.getElementById('userListSection').style.display = 'none';
        document.getElementById('createUserSection').style.display = 'none';
        document.getElementById('tokenSection').style.display = 'none';
        showApiDocs();
    });

    document.getElementById('createUserBtn').addEventListener('click', () => {
        document.getElementById('createUserSection').style.display = 'block';
        document.getElementById('userListSection').style.display = 'none';
        document.getElementById('documentationSection').style.display = 'none';
        document.getElementById('tokenSection').style.display = 'none';
    });

    document.getElementById('showUsersBtn').addEventListener('click', () => {
        document.getElementById('createUserSection').style.display = 'none';
        document.getElementById('userListSection').style.display = 'block';
        document.getElementById('documentationSection').style.display = 'none';
        document.getElementById('tokenSection').style.display = 'none';
        fetchUsers();
    });

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
        console.log('OAuth code found:', code); // Отладка
        fetch('/.netlify/functions/authCallback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from authCallback:', data); // Отладка
            if (data.token) {
                document.getElementById('tokenSection').style.display = 'block';
                document.getElementById('tokenArea').value = data.token;
                window.history.replaceState({}, document.title, "/");
            } else {
                alert('Failed to obtain token');
            }
        })
        .catch(error => {
            console.error('Error fetching token:', error);
        });
    }
});

async function createUser(userData) {
    try {
        const response = await fetch('https://alexqa.netlify.app/api/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

async function fetchUsers() {
    try {
        const response = await fetch('https://alexqa.netlify.app/api/getUsers');
        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function showApiDocs() {
    const docsContainer = document.getElementById('apiDocs');
    docsContainer.innerHTML = `
        <h2>API Documentation</h2>
        <h3>1. Create User</h3>
        <pre>POST /api/createUser
        Request Body:
        {
            "name": "string",
            "email": "string",
            "age": "number"
        }
        Response:
        201 Created
        </pre>

        <h3>2. Get All Users</h3>
        <pre>GET /api/getUsers
        Response:
        [
            {
                "id": "string",
                "name": "string",
                "email": "string",
                "age": "number"
            }
        ]
        </pre>

        <h3>3. Get User by ID</h3>
        <pre>GET /api/getUsers/{id}
        Response:
        {
            "id": "string",
            "name": "string",
            "email": "string",
            "age": "number"
        }
        </pre>

        <h3>4. Update User</h3>
        <pre>PUT /api/users/{id}
        Request Body:
        {
            "name": "string",
            "email": "string",
            "age": "number"
        }
        Response:
        200 OK
        </pre>

        <h3>5. Delete User</h3>
        <pre>DELETE /api/users/{id}
        Response:
        200 OK
        </pre>
    `;
}
