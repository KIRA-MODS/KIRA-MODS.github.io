
document.addEventListener('DOMContentLoaded', function() {
    // Функция для получения сохраненных пользователей из localStorage
    function getUsersFromLocalStorage() {
        const usersJSON = localStorage.getItem('users');
        return usersJSON ? JSON.parse(usersJSON) : {};
    }

    // Функция для сохранения пользователей в localStorage
    function saveUsersToLocalStorage(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Функция для получения сохраненных комментариев из localStorage
    function getCommentsFromLocalStorage() {
        const commentsJSON = localStorage.getItem('comments');
        return commentsJSON ? JSON.parse(commentsJSON) : [];
    }

    // Функция для сохранения комментариев в localStorage
    function saveCommentsToLocalStorage(comments) {
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    // Функция для проверки, авторизован ли пользователь
    function isLoggedIn() {
        return localStorage.getItem('loggedInUser') !== null;
    }

    // Функция для проверки, является ли пользователь админом
    function isAdmin() {
        return localStorage.getItem('loggedInUser') === 'KIRA';
    }

    // Функция для обновления статуса авторизации в навигации
    function updateAuthStatus() {
        const authStatusSpan = document.getElementById('auth-status');
        const commentForm = document.querySelector('.comment-form');
        const authSection = document.getElementById('auth-section');
        const isModsPage = window.location.pathname.endsWith('mods.html');

        if (isLoggedIn()) {
            const loggedInUser = localStorage.getItem('loggedInUser');
            authStatusSpan.textContent = `Вы вошли как: ${loggedInUser} | Выйти`;
            authStatusSpan.style.cursor = 'pointer';
            authStatusSpan.style.color = 'green';
            if(commentForm){
                commentForm.style.display = 'block';
            }
            if(authSection){
                authSection.style.display = 'none';
            }
            authStatusSpan.addEventListener('click', logout)
        } else {
            authStatusSpan.textContent = 'Вы не вошли';
            if(commentForm){
                commentForm.style.display = 'none';
            }
            if(authSection){
                authSection.style.display = 'block';
            }

            authStatusSpan.style.cursor = '';
            authStatusSpan.style.color = '';
            authStatusSpan.removeEventListener('click', logout)
        }
    }

    // Функция для регистрации пользователя
    function registerUser(username, password) {
        const users = getUsersFromLocalStorage();

        if (users[username]) {
            alert("Пользователь с таким именем уже существует.");
            return false;
        }

        users[username] = password;
        saveUsersToLocalStorage(users);
        alert("Регистрация успешна");
        return true;
    }

    // Функция для входа пользователя
    function loginUser(username, password) {
        const users = getUsersFromLocalStorage();
        if (users[username] && users[username] === password) {
            localStorage.setItem('loggedInUser', username);
            updateAuthStatus();
            alert("Вход успешен!");
            return true;
        } else {
            alert("Неверное имя пользователя или пароль.");
            return false;
        }
    }

    function logout() {
        localStorage.removeItem('loggedInUser');
        updateAuthStatus();
        alert("Вы вышли!");
    }

    function addComment(commentText) {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const newComment = {
            user: loggedInUser,
            text: commentText,
            timestamp: new Date().toLocaleString()
        };

        const comments = getCommentsFromLocalStorage();
        comments.push(newComment);
        saveCommentsToLocalStorage(comments);
        displayComments();
    }

    function displayComments() {
        const commentsContainer = document.getElementById('comments-container');
        if(!commentsContainer){
            return;
        }
        commentsContainer.innerHTML = '';
        const comments = getCommentsFromLocalStorage();
         console.log("Comments:", comments); // <--- Проверка!

        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');

            const userSpan = document.createElement('span');
            userSpan.classList.add('comment-user');
            userSpan.textContent = comment.user;

            const timeSpan = document.createElement('span');
            timeSpan.classList.add('comment-time');
            timeSpan.textContent = comment.timestamp;

            const textP = document.createElement('p');
            textP.classList.add('comment-text');
            textP.textContent = comment.text;

            commentDiv.appendChild(userSpan);
            commentDiv.appendChild(timeSpan);
            commentDiv.appendChild(textP);
            commentsContainer.appendChild(commentDiv);

        });
    }

    const registerForm = document.getElementById('registration-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent page reload
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            if (registerUser(username, password)) {
                registerForm.reset();
            }
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent page reload
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            if (loginUser(username, password)) {
                loginForm.reset();
            }
        });
    }

    const commentForm = document.querySelector('.comment-form');
    if(commentForm) {
        commentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const commentText = document.getElementById('comment-text').value;
            if (commentText.trim() !== '') {
                addComment(commentText);
                document.getElementById('comment-text').value = ''; // Reset text input
            }
        });
    }

    displayComments();
    updateAuthStatus();
});

