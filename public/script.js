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

    try {
        const response = await fetch('/.netlify/functions/createUser', { // Путь к функции Netlify
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, age }),
        });

        if (response.ok) {
            document.getElementById('createUserForm').reset();
            fetchUsers(); // Обновить список пользователей
        } else {
            console.error('Error creating user:', response.statusText);
            alert('Error creating user. Please try again.');
        }
    } catch (error) {
        console.error('Error creating user:', error);
        alert('Error creating user. Please try again.');
    }
});

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

// Функция для получения списка пользователей
async function fetchUsers() {
    try {
        const response = await fetch('/.netlify/functions/getUsers'); // Путь к функции Netlify
        if (response.ok) {
            const users = await response.json();
            const userList = document.getElementById('userList');
            userList.innerHTML = '';
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.name} (${user.email}, ${user.age} years old)`;
                userList.appendChild(li);
            });
        } else {
            console.error('Error fetching users:', response.statusText);
            alert('Error fetching users. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Error fetching users. Please try again.');
    }
}
