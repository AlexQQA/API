// Функция вызывается при успешной авторизации
function onSignIn(googleUser) {
    // Получаем токен и информацию о пользователе
    const profile = googleUser.getBasicProfile();
    const idToken = googleUser.getAuthResponse().id_token;

    // Показать информацию о пользователе
    document.getElementById('userInfo').style.display = 'block';
    document.getElementById('userInfo').innerHTML = `
        <p>Signed in as: ${profile.getName()}</p>
        <p>Email: ${profile.getEmail()}</p>
    `;

    // Изменить текст кнопки Sign In на Sign Out
    document.getElementById('signInBtn').innerText = 'Sign Out';
    document.getElementById('signInBtn').addEventListener('click', () => {
        signOut();
    });

    // Прячем кнопку Google Sign-In
    document.querySelector('.g-signin2').style.display = 'none';
}

// Функция для выхода из системы
function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        // Очистить информацию о пользователе
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('signInBtn').innerText = 'Sign In';
        document.querySelector('.g-signin2').style.display = 'block';
    });
}

// Инициализация Google API
function initGoogleSignIn() {
    gapi.load('auth2', () => {
        gapi.auth2.init({
            client_id: '249425105169-8gfnkub71sjsr9d6jei87294h96o2n7i.apps.googleusercontent.com'
        });
    });
}

// Вызов функции инициализации после загрузки страницы
window.onload = initGoogleSignIn;

// Существующие обработчики
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
                const li = document.createElement('li');
                li.textContent = `${user.name} (${user.email}), Age: ${user.age}`;
                userList.appendChild(li);
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
