// Обработчик кнопок
document.getElementById('generateKeyBtn').addEventListener('click', () => {
    alert('Key generation functionality will be implemented here.');
});

document.getElementById('documentationBtn').addEventListener('click', () => {
    document.getElementById('documentationSection').style.display = 'block';
    document.getElementById('userListSection').style.display = 'none';
    document.getElementById('createUserSection').style.display = 'none';
    showApiDocs(); // Показать документацию API
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
    fetchUsers(); // Обновить список пользователей
});

// Обработчик формы создания пользователя
document.getElementById('createUserForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;

    const userData = { name, email, age };

    const result = await createUser(userData);
    if (result) {
        alert('User created successfully');
        fetchUsers(); // Обновить список пользователей после создания нового
    } else {
        alert('Failed to create user');
    }
});

// Функция для создания пользователя
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

// Функция для получения и отображения списка пользователей
async function fetchUsers() {
    try {
        const response = await fetch('https://alexqa.netlify.app/api/getUsers');
        const users = await response.json();

        if (Array.isArray(users)) {
            const userList = document.getElementById('userList');
            userList.innerHTML = ''; // Очистить текущий список

            users.forEach(user => {
                const listItem = document.createElement('li');
                listItem.textContent = `${user.name} (${user.email}, ${user.age} years old)`;
                userList.appendChild(listItem);
            });
        } else {
            throw new Error('Expected an array of users');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Функция для получения и отображения документации API
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
