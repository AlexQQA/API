document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
  
    const googleSignInBtn = document.getElementById('signInWithGoogle');
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', () => {
            console.log('Google Sign In clicked');
            window.location.href = 'https://accounts.google.com/o/oauth2/auth?client_id=249425105169-8gfnkub71sjsr9d6jei87294h96o2n7i.apps.googleusercontent.com&redirect_uri=https://alexqa.netlify.app/&response_type=code&scope=email%20profile';
        });
    } else {
        console.error('Google Sign In button not found');
    }
  
    const gitHubSignInBtn = document.getElementById('signInWithGitHub');
    if (gitHubSignInBtn) {
        gitHubSignInBtn.addEventListener('click', () => {
            console.log('GitHub Sign In clicked');
            window.location.href = 'https://github.com/login/oauth/authorize?client_id=Ov23liUm9zDqtXxfqLwa&redirect_uri=https://alexqa.netlify.app/.netlify/functions/github-callback';
        });
    } else {
        console.error('GitHub Sign In button not found');
    }
  });
  