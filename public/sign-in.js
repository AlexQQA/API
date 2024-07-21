document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signInWithGoogle').addEventListener('click', () => {
        window.location.href = 'https://accounts.google.com/o/oauth2/auth?client_id=249425105169-8gfnkub71sjsr9d6jei87294h96o2n7i.apps.googleusercontent.com&redirect_uri=https://alexqa.netlify.app/&response_type=code&scope=email%20profile';
    });

    document.getElementById('signInWithGitHub').addEventListener('click', () => {
        window.location.href = 'https://github.com/login/oauth/authorize?client_id=Ov23liUm9zDqtXxfqLwa&redirect_uri=https://alexqa.netlify.app/';
    });
});

netlifyIdentity.on('login', user => {
    console.log('User logged in:', user);
    alert('Login successful! Token: ' + user.token.access_token);
    window.location.href = 'index.html';
});

netlifyIdentity.init();
