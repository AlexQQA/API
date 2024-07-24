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
});

document.getElementById('documentationBtn').addEventListener('click', () => {
    document.getElementById('createUserSection').style.display = 'none';
    document.getElementById('userListSection').style.display = 'none';
    document.getElementById('documentationSection').style.display = 'block';
    document.getElementById('tokenSection').style.display = 'none';
});

document.getElementById('generateKeyBtn').addEventListener('click', () => {
    document.getElementById('createUserSection').style.display = 'none';
    document.getElementById('userListSection').style.display = 'none';
    document.getElementById('documentationSection').style.display = 'none';
    document.getElementById('tokenSection').style.display = 'block';
});

document.getElementById('createUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;

    const userData = { name, email, age };

    try {
        const response = await fetch('/api/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const result = await response.json();
            alert('User created successfully: ' + result.userId);
        } else {
            const error = await response.json();
            alert('Error creating user: ' + error.message);
        }
    } catch (error) {
        console.error('Error creating user:', error);
        alert('Failed to create user');
    }
});

document.getElementById('showUsersBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/getUsers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const users = await response.json();
            const userList = document.getElementById('userList');
            userList.innerHTML = '';
            users.forEach(user => {
                const listItem = document.createElement('li');
                listItem.textContent = `${user.name} (${user.email})`;
                userList.appendChild(listItem);
            });
        } else {
            const error = await response.json();
            alert('Error fetching users: ' + error.message);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to fetch users');
    }
});
