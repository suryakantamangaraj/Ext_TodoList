document.getElementById('addButton').addEventListener('click', function() {
    var todoInput = document.getElementById('todoInput');
    var todo = todoInput.value;
    if (todo) {
        chrome.storage.local.get(['todos'], function(data) {
            var todos = data.todos || [];
            todos.push({ task: todo, completed: false });
            chrome.storage.local.set({ todos: todos }, function() {
                renderTodos(todos);
                todoInput.value = '';
            });
        });
    }
});

document.getElementById('selectAllButton').addEventListener('click', function() {
    var selectAllButton = document.getElementById('selectAllButton');
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var allSelected = Array.from(checkboxes).every(checkbox => checkbox.checked);

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = !allSelected;
    });

    selectAllButton.textContent = allSelected ? 'Select All' : 'Unselect All';
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

document.getElementById('statusChangeButton').addEventListener('click', function() {
    chrome.storage.local.get('todos', function(data) {
        var todos = data.todos.map(function(todo, index) {
            if (document.getElementById('checkbox-' + index).checked) {
                todo.completed = !todo.completed;
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
        if (todo.completed) {
            span.classList.add('completed');
        } else {
            span.classList.remove('completed');
        }
        var actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';

        var statusButton = document.createElement('button');
        statusButton.textContent = todo.completed ? 'Ongoing' : 'Completed';
        statusButton.addEventListener('click', function() {
            toggleStatusTask(index);
        });

        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            deleteTask(index);
        });

        actionButtons.appendChild(statusButton);
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

function toggleStatusTask(index) {
    chrome.storage.local.get('todos', function(data) {
        var todos = data.todos;
        todos[index].completed = !todos[index].completed;
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
