document.getElementById('addButton').addEventListener('click', function() {
    var todoInput = document.getElementById('todoInput');
    var todo = todoInput.value;
    if (todo) {
        chrome.storage.local.get(['todos'], function(data) {
            var todos = data.todos || [];
            todos.push({ task: todo, archived: false });
            chrome.storage.local.set({ todos: todos }, function() {
                renderTodos(todos);
                todoInput.value = '';
            });
        });
    }
});

document.getElementById('deleteSelectedButton').addEventListener('click', function() {
    chrome.storage.local.get('todos', function(data) {
        var todos = data.todos.filter(function(todo, index) {
            return !document.getElementById('checkbox-' + index).checked;
        });
        chrome.storage.local.set({ todos: todos }, function() {
            renderTodos(todos);
        });
    });
});

document.getElementById('archiveSelectedButton').addEventListener('click', function() {
    chrome.storage.local.get('todos', function(data) {
        var todos = data.todos.map(function(todo, index) {
            if (document.getElementById('checkbox-' + index).checked) {
                todo.archived = !todo.archived;
            }
            return todo;
        });
        chrome.storage.local.set({ todos: todos }, function() {
            renderTodos(todos);
        });
    });
});

function renderTodos(todos) {
    var todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    todos.forEach(function(todo, index) {
        var li = document.createElement('li');
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'checkbox-' + index;
        var span = document.createElement('span');
        span.textContent = todo.task;
        if (todo.archived) {
            span.classList.add('archived');
        } else {
            span.classList.remove('archived');
        }
        var actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';

        var archiveButton = document.createElement('button');
        archiveButton.textContent = todo.archived ? 'Unarchive' : 'Archive';
        archiveButton.addEventListener('click', function() {
            toggleArchiveTask(index);
        });

        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            deleteTask(index);
        });

        actionButtons.appendChild(archiveButton);
        actionButtons.appendChild(deleteButton);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(actionButtons);
        todoList.appendChild(li);
    });
}

function deleteTask(index) {
    chrome.storage.local.get('todos', function(data) {
        var todos = data.todos;
        todos.splice(index, 1);
        chrome.storage.local.set({ todos: todos }, function() {
            renderTodos(todos);
        });
    });
}

function toggleArchiveTask(index) {
    chrome.storage.local.get('todos', function(data) {
        var todos = data.todos;
        todos[index].archived = !todos[index].archived;
        chrome.storage.local.set({ todos: todos }, function() {
            renderTodos(todos);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get('todos', function(data) {
        renderTodos(data.todos || []);
    });
});
