document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded');

    document.getElementById('signInBtn').addEventListener('click', () => {
        window.location.href = 'sign-in.html';
    });

    // Обработка OAuth кода
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
        console.log('OAuth code found:', code);
        fetch('/.netlify/functions/authCallback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from authCallback:', data);
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
