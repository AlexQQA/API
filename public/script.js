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
    showApiDocs();
});

document.getElementById('createUserBtn').addEventListener('click', () => {
    document.getElementById('createUserSection').style.display = 'block';
    document.getElementById('userListSection').style.display = 'none';
    document.getElementById('documentationSection').style.display = 'none';
});

document.getElementById('showUsersBtn').addEventListener('click', () => {
    document.getElementById('createUserSection').style.display = 'none';
    document.getElementById('userListSection').style.display = 'block';
    document.getElementById('documentationSection').style.display = 'none';
    fetchUsers();
});

document.getElementById('createUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    const userData = { name, email, age };
    const result = await createUser(userData);
    alert(result.message || 'User created successfully');
});

async function createUser(userData) {
    try {
        const response = await fetch('/.netlify/functions/createUser', {
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
        const response = await fetch('/.netlify/functions/getUsers');
        const users = await response.json();
        const userList = document.getElementById('userList');
        userList.innerHTML = '';
        users.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = `${user.name} (${user.email}) - Age: ${user.age}`;
            userList.appendChild(listItem);
        });
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
