if (JSON.parse(localStorage.getItem("todos")) === null) {
	var todoStorage = [];
} else {
	var todoStorage = JSON.parse(localStorage.getItem("todos"));
}

var todoList = {
	
	todos: todoStorage,

	updateStorage: function(todos) {
		localStorage.setItem("todos", JSON.stringify(this.todos));
	},
	
	addTodo: function(todoText, todoTag) {
		this.todos.push({
			todoText: todoText,
			completed: false,
			todoTag: todoTag,
		});
		this.updateStorage();
	},

	changeTodo: function(position, todoText, todoTag) {
		this.todos[position].todoText = todoText;
		this.todos[position].todoTag = todoTag;
		this.updateStorage();
	},

	deleteTodo: function(position) {
		this.todos.splice(position, 1);
		this.updateStorage();
	},

	toggleCompleted: function(position) {
		var todo = this.todos[position];
		todo.completed = !todo.completed
		this.updateStorage();
	},

	toggleAll: function() {
		// Get number of total todos
		var totalTodos = this.todos.length;

		// Get number of completed todos
		var completedTodos = 0;
		this.todos.forEach(function(todo) {
			if (todo.completed === true) {
				completedTodos++;
			}
		});

		this.todos.forEach(function(todo) {
			// Case 1: If everything's true, make everything false
			if (completedTodos === totalTodos) {
				todo.completed = false;
			// Case 2: Otherwise, make everything true
			} else {
				todo.completed = true;
			}
		});
		this.updateStorage();
	}
};


var handlers = {
	addTodo: function() {
		var addTodoTextInput = document.getElementById('addTodoTextInput');
		var addTodoTagInput = document.getElementById('addTodoTagInput');
		if (addTodoTextInput.value.replace(/ /g,'') === '') {
		} else {
			todoList.addTodo(addTodoTextInput.value, addTodoTagInput.value);
			addTodoTextInput.value = '';
			addTodoTagInput.value = '';
			view.displayTodos();
		}
	},
	updateTodo: function(position) {
		var changeTodoTextInput = document.getElementById('changeTodoTextInput');
		var changeTodoTagInput = document.getElementById('changeTodoTagInput');
		if (changeTodoTextInput.value.replace(/ /g,'') === '') {
		} else {
			todoList.changeTodo(position, changeTodoTextInput.value, changeTodoTagInput.value);
			view.displayTodos();
		}
	},
	deleteTodo: function(position) {
		todoList.deleteTodo(position);
		view.displayTodos();
	},
	toggleCompleted: function(position) {
		todoList.toggleCompleted(position);
		view.displayTodos();
	},
	toggleAll: function() {
		todoList.toggleAll();
		view.displayTodos();
	},
	editTodo: function(position) {
		view.editTodo(position);		
	}
};


var view = {
	displayTodos: function() {
		var todosUl = document.querySelector('ul');
		todosUl.innerHTML = '';
		if (todoList.todos.length === 0) {
			todosUl.innerHTML = 'You have no todos!';
		} else {
			todoList.todos.forEach(function(todo, position) {
				var todoLi = document.createElement('li');
				todoLi.className = 'todoItem list-group-item';
				var todoTextWithTag = '';

				if (todo.completed === true) {
					todoLi.className += ' completed';
					todoTextWithTag = '[' + todo.todoTag + '] ' + todo.todoText;
				} else {
					todoTextWithTag = '[' + todo.todoTag + '] '  + todo.todoText;
				}

				todoLi.id = position;
				todoLi.textContent = todoTextWithTag;
				todoLi.appendChild(this.createCompleteButton());
				todoLi.appendChild(this.createDeleteButton());
				todoLi.appendChild(this.createEditButton());
				todosUl.appendChild(todoLi);
			}, this);			
		}
	},
	editTodo: function(position) {
		var todo = todoList.todos[position];
		var todoLi = document.getElementById(position);
		todoLi.innerHTML = '';
		todoLi.appendChild(this.createEditTextInput(todo));
		todoLi.appendChild(this.createEditTagInput(todo));
		todoLi.appendChild(this.createSaveButton());
		todoLi.appendChild(this.createCancelButton());
	},
	createDeleteButton: function() {
		var deleteButton = document.createElement('button');
		deleteButton.textContent = 'x';
		deleteButton.className = 'deleteButton btn btn-sm btn-danger';
		return deleteButton;
	},
	createCompleteButton: function() {
		var completeButton = document.createElement('button');
		completeButton.textContent = 'v';
		completeButton.className = 'completeButton btn btn-sm btn-success';
		return completeButton;
	},
	createEditButton: function() {
		var editButton = document.createElement('button');
		editButton.textContent = 'edit';
		editButton.className = 'editButton btn btn-sm btn-primary';
		return editButton;
	},
	createEditTextInput: function(todo) {
		var editTextInput = document.createElement('input');
		editTextInput.type = 'text';
		editTextInput.value = todo.todoText;
		editTextInput.placeholder = 'Text...';
		editTextInput.id = 'changeTodoTextInput';
		editTextInput.className += 'form-control';
		return editTextInput;
	},
	createEditTagInput: function(todo) {
		var editTagInput = document.createElement('input');
		editTagInput.type = 'text';
		editTagInput.value = todo.todoTag;
		editTagInput.placeholder = 'Tag...';
		editTagInput.id = 'changeTodoTagInput';
		editTagInput.className += 'form-control';
		return editTagInput;
	},	
	createSaveButton: function() {
		var saveButton = document.createElement('button');
		saveButton.textContent = 'save';
		saveButton.className = 'saveButton btn btn-sm btn-success';
		return saveButton;
	},
	createCancelButton: function() {
		var cancelButton = document.createElement('button');
		cancelButton.textContent = 'cancel';
		cancelButton.className = 'cancelButton btn btn-sm btn-warning';
		return cancelButton;
	},
	setUpEventListeners: function() {
		var todosUl = document.querySelector('ul');

		todosUl.addEventListener('click', function(event) {
			
			var elementClicked = event.target;

			// console.log(event.target);

			if (elementClicked.classList.contains('deleteButton')) {
				handlers.deleteTodo(parseInt(elementClicked.parentNode.id));
			}

			if (elementClicked.classList.contains('completeButton')) {
				handlers.toggleCompleted(parseInt(elementClicked.parentNode.id));
			}

			if (elementClicked.classList.contains('editButton')) {
				handlers.editTodo(parseInt(elementClicked.parentNode.id));
			}

			if (elementClicked.classList.contains('saveButton')) {
				handlers.updateTodo(parseInt(elementClicked.parentNode.id));
			}

			if (elementClicked.classList.contains('cancelButton')) {
				view.displayTodos();
			}
		});
	}
};

view.setUpEventListeners();
view.displayTodos();
