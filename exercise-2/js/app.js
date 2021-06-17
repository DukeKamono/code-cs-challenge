var Task = function() {
	var taskInput = document.getElementById("new-task");
	var addButton = document.getElementsByTagName("button")[0];
	var resetButton = document.getElementById("Reset");
//	var incompleteTasksHolder = document.getElementById("incomplete-tasks");
//	var completedTasksHolder = document.getElementById("completed-tasks");

	var incompleteTasksHolder = loadTasks("incomplete-tasks");
	var completedTasksHolder = loadTasks("completed-tasks");
	
	var createNewTaskElement = function(taskString, arr) {
	listItem = document.createElement("li");
	checkBox = document.createElement("input");
	label = document.createElement("label");
	editInput = document.createElement("input");
	editButton = document.createElement("button");
	deleteButton = document.createElement("button");
	
	checkBox.type = "checkbox";
	editInput.type = "text";
	editButton.innerText = "Edit";
	editButton.className = "edit";
	deleteButton.innerText = "Delete";
	deleteButton.className = "delete";
	label.innerText = taskString;
	
	listItem.appendChild(checkBox);
	listItem.appendChild(label);
	listItem.appendChild(editInput);
	listItem.appendChild(editButton);
	listItem.appendChild(deleteButton);
	
	return listItem;
	};
	
	function loadTasks(taskType) {
		if (localStorage.getItem(taskType)) {
			var tempTasks = document.getElementById(taskType);
			tempTasks.innerHTML = JSON.parse(localStorage.getItem(taskType));
			return tempTasks;
		} else {
			return document.getElementById(taskType);
		}
	}
	
	function saveTasks() {
		localStorage.setItem("incomplete-tasks", JSON.stringify(incompleteTasksHolder.innerHTML));
		localStorage.setItem("completed-tasks", JSON.stringify(completedTasksHolder.innerHTML));
	}
	
	function addTask() {
		var listItemName = taskInput.value || "New Item"
		listItem = createNewTaskElement(listItemName)
		incompleteTasksHolder.appendChild(listItem)
		bindTaskEvents(listItem, taskCompleted)
		taskInput.value = "";
		saveTasks();
	};
	
	function taskCompleted(el, parentNode) {
		if (!parentNode) {
			parentNode = this.parentNode;
		}
		var listItem = parentNode;
		completedTasksHolder.appendChild(listItem);
		bindTaskEvents(listItem, taskIncomplete);
		saveTasks();
	};
	
	function taskIncomplete(el, parentNode) {
		if (!parentNode) {
			parentNode = this.parentNode;
		}
		var listItem = parentNode;
		incompleteTasksHolder.appendChild(listItem);
		bindTaskEvents(listItem, taskCompleted);
		saveTasks();
	};
	
	function bindTaskEvents(taskListItem, checkBoxEventHandler, cb) {
		var checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
		var editButton = taskListItem.querySelectorAll("button.edit")[0];
		var deleteButton = taskListItem.querySelectorAll("button.delete")[0];
		editButton.onclick = editTask;
		deleteButton.onclick = deleteTask;
		checkBox.onchange = checkBoxEventHandler;
		saveTasks();
	};
	
	function editTask() {
		var listItem = this.parentNode;
		var editInput = listItem.querySelectorAll("input[type=text")[0];
		var label = listItem.querySelector("label");
		var button = listItem.getElementsByTagName("button")[0];
		
		var containsClass = listItem.classList.contains("editMode");
		if (containsClass) {
			label.innerText = editInput.value
			button.innerText = "Edit";
		} else {
			editInput.value = label.innerText
			button.innerText = "Save";
		}
		
		listItem.classList.toggle("editMode");
		saveTasks();
	};
	
	function deleteTask(el) {
		var listItem = this.parentNode;
		var ul = listItem.parentNode;
		ul.removeChild(listItem);
		saveTasks();
	};
	
	return {	
		
	    AddTask: function () {
			addTask();
		},
		
		TaskCompleted: function (el) {
			taskCompleted(el, this.parentNode);
		},
		
		TaskIncomplete: function(el) {
			taskIncomplete(el, this.parentNode);
		},
		
		BindTaskEvents: function (taskListItem, checkBoxEventHandler, cb) {
			bindTaskEvents(taskListItem, checkBoxEventHandler, cb);
		},
		
		ResetStoredTasks: function () {
			window.localStorage.clear();
			location.reload();
		},
		
		AddButton: function() {
			return addButton;
		},
		
		CompletedTasksHolder: function() {
			return completedTasksHolder;
		},
		
		IncompleteTasksHolder: function() {
			return incompleteTasksHolder;
		},
		
		ResetButton: function() {
			return resetButton;
		}
	}
};

(function() {
	var task = Task();
	
	if (task.AddButton()) {
		task.AddButton().addEventListener("click", task.AddTask);
	}
	
	if (task.ResetButton()) {
		task.ResetButton().addEventListener("click", task.ResetStoredTasks);
	}
	
	if (task.IncompleteTasksHolder()) {
		for (var i = 0; i < task.IncompleteTasksHolder().children.length; i++) {
		task.BindTaskEvents(task.IncompleteTasksHolder().children[i], task.TaskCompleted);
		}
	}
	
	if (task.CompletedTasksHolder()) {
		for (var i = 0; i < task.CompletedTasksHolder().children.length; i++) {
		task.BindTaskEvents(task.CompletedTasksHolder().children[i], task.TaskIncomplete);
		}
	}
})();