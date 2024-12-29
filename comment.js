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
            authStatusSpan.style.color = 'green'
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

        if (!users[username] || users[username] !== password) {
           alert("Неверный логин или пароль.");
           return false;
       }

      localStorage.setItem('loggedInUser', username);
         updateAuthStatus()
         alert("Вход выполнен!");
           return true;
    }
     function logout() {
        localStorage.removeItem('loggedInUser');
        updateAuthStatus();
    }
    function clearData() {
           localStorage.clear();
           alert("Данные очищены!");
           location.reload(); // Перезагружаем страницу для обновления
        }
     // Обработчик для формы регистрации
     const registerForm = document.getElementById('register-form');
     if (registerForm) {
      registerForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
       if (registerUser(username, password)){
              document.getElementById('register-username').value = '';
               document.getElementById('register-password').value = '';
         }

        });
    }

    // Обработчик для формы входа
     const loginForm = document.getElementById('login-form');
      if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
         event.preventDefault();
        const username = document.getElementById('login-username').value;
         const password = document.getElementById('login-password').value;
        if (loginUser(username, password)){
             document.getElementById('login-username').value = '';
             document.getElementById('login-password').value = '';
          }
     });
    }
      // Функция удаления комментария
    function deleteComment(index) {
        const comments = getCommentsFromLocalStorage();
         comments.splice(index, 1);
      saveCommentsToLocalStorage(comments);
      displayStoredComments()
    }
    function addComment() {
        const authorInput = document.getElementById('comment-author');
        const commentTextarea = document.getElementById('comment-text');
         const author = localStorage.getItem('loggedInUser'); // Берем имя пользователя из localStorage
        const commentText = commentTextarea.value.trim();
          if (!isLoggedIn()) {
                alert("Пожалуйста, зарегистрируйтесь или войдите, чтобы оставить комментарий.");
                return;
          }

        if (author === "" || commentText === "") {
            alert("Пожалуйста, введите имя и текст комментария.");
            return;
        }
      const commentsList = document.getElementById('comments-list');
        const newComment = {
           author: author,
          text: commentText,
        };
     const comments = getCommentsFromLocalStorage();
        comments.push(newComment);
        saveCommentsToLocalStorage(comments);

       // Добавление комментария в DOM
      const newCommentDiv = document.createElement('div');
       newCommentDiv.classList.add('comment');
        newCommentDiv.innerHTML = `
           <div class="author">${author}</div>
           <div class="text">${commentText}</div>
      `;
     commentsList.appendChild(newCommentDiv);
           commentTextarea.value = "";
    }

      // Функция для отображения сохраненных комментариев при загрузке страницы
    function displayStoredComments() {
       const commentsList = document.getElementById('comments-list');
        if (commentsList) {
            commentsList.innerHTML = '';
        const comments = getCommentsFromLocalStorage();
        comments.forEach((comment, index) => {
            const newCommentDiv = document.createElement('div');
            newCommentDiv.classList.add('comment');
             newCommentDiv.innerHTML = `
                  <div class="author">${comment.author}</div>
                 <div class="text">${comment.text}</div>
               `;
                if (isAdmin()) {
                    const deleteButton = document.createElement('button');
                   deleteButton.textContent = 'Удалить';
                    deleteButton.onclick = () => deleteComment(index);
                   newCommentDiv.appendChild(deleteButton);
                 }
             commentsList.appendChild(newCommentDiv);
          });
       }
    }
     // Обработчик для кнопки удаления данных
     const clearDataButton = document.getElementById('clear-data');
    const isIndexPage = window.location.pathname.endsWith('index.html');
    if (clearDataButton) {
          if (isAdmin()&&isIndexPage) {
              clearDataButton.style.display = 'inline-block'; // Показать кнопку для админа на главной
               clearDataButton.addEventListener('click', clearData);
          } else {
                clearDataButton.style.display = 'none'; // Скрыть кнопку для всех остальных
              clearDataButton.removeEventListener('click', clearData);
         }
    }


    // Назначение функции addComment кнопке отправки
    const submitButton = document.querySelector('.comment-form button');
      if(submitButton){
       submitButton.addEventListener('click', addComment);
      }
    displayStoredComments();
    updateAuthStatus(); // Инициализируем статус авторизации
});
