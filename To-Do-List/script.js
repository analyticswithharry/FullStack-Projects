// Select DOM elements
const taskInput = document.getElementById('taskInput'); // Gets the input element with id="taskInput"
const taskList = document.getElementById('taskList'); // Gets the ul element with id="taskList"
const error = document.getElementById('error'); // Gets the error message paragraph with id="error"
const taskCount = document.getElementById('taskCount'); // Gets the span for total task count
const completedCount = document.getElementById('completedCount'); // Gets the span for completed task count

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', () => { // Runs when the DOM is fully loaded
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Gets tasks from localStorage or an empty array
    tasks.forEach(task => renderTask(task.text, task.completed)); // Renders each saved task with its completion status
    updateStats(); // Updates task and completed counts
});

// Add task function
function addTask() { // Defines function to add a new task
    const text = taskInput.value.trim(); // Gets input value and removes whitespace
    if (text === '') { // Checks if input is empty
        error.textContent = 'Please enter a task!'; // Sets error message text
        error.classList.remove('hidden'); // Shows error message by removing hidden class
        setTimeout(() => { // Hides error after 2 seconds
            error.classList.add('hidden'); // Adds hidden class to error
        }, 2000);
        return; // Exits function if input is empty
    }
    if (text.length > 100) { // Checks if input exceeds 100 characters
        error.textContent = 'Task is too long (max 100 characters)!'; // Sets error message
        error.classList.remove('hidden'); // Shows error message
        setTimeout(() => { // Hides error after 2 seconds
            error.classList.add('hidden'); // Adds hidden class
        }, 2000);
        return; // Exits function if input is too long
    }

    renderTask(text, false); // Renders new task (not completed)
    saveTask(text, false); // Saves task to localStorage
    taskInput.value = ''; // Clears input field
    updateStats(); // Updates task and completed counts
}

// Render a task to the DOM
function renderTask(text, completed) { // Defines function to render a task with text and completion status
    const li = document.createElement('li'); // Creates a new li element
    li.innerHTML = `<span onclick="toggleTask(this)">${text}</span><button class="delete-btn" onclick="deleteTask(this)">Delete</button>`; // Sets li content with task text and delete button
    if (completed) { // Checks if task is completed
        li.classList.add('completed'); // Adds completed class if true
    }
    taskList.appendChild(li); // Adds li to task list
}

// Save task to localStorage
function saveTask(text, completed) { // Defines function to save a task
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Gets existing tasks or empty array
    tasks.push({ text, completed }); // Adds new task object to array
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Saves updated tasks to localStorage
}

// Toggle task completion
function toggleTask(span) { // Defines function to toggle task completion, takes clicked span
    span.parentElement.classList.toggle('completed'); // Toggles completed class on parent li
    updateTaskInStorage(span.textContent, span.parentElement.classList.contains('completed')); // Updates task status in localStorage
    updateStats(); // Updates task and completed counts
}

// Update task in localStorage
function updateTaskInStorage(text, completed) { // Defines function to update a task’s completion status
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Gets tasks from localStorage
    const updatedTasks = tasks.map(task => task.text === text ? { ...task, completed } : task); // Updates completion status for matching task
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Saves updated tasks
}

// Delete task
function deleteTask(button) { // Defines function to delete a task, takes clicked button
    const text = button.previousElementSibling.textContent; // Gets task text from sibling span
    button.parentElement.remove(); // Removes the parent li from DOM
    removeTaskFromStorage(text); // Removes task from localStorage
    updateStats(); // Updates task and completed counts
}

// Remove task from localStorage
function removeTaskFromStorage(text) { // Defines function to remove a task from storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Gets tasks from localStorage
    const updatedTasks = tasks.filter(task => task.text !== text); // Filters out task with matching text
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Saves updated tasks
}

// Clear all tasks
function clearAllTasks() { // Defines function to clear all tasks
    taskList.innerHTML = ''; // Clears all list items from DOM
    localStorage.removeItem('tasks'); // Removes tasks from localStorage
    updateStats(); // Updates task and completed counts
}

// Update task statistics
function updateStats() { // Defines function to update task and completed counts
    const tasks = taskList.children.length; // Counts total tasks (li elements)
    const completed = taskList.querySelectorAll('.completed').length; // Counts completed tasks
    taskCount.textContent = `Tasks: ${tasks}`; // Updates task count display
    completedCount.textContent = `Completed: ${completed}`; // Updates completed count display
}

// Add task on Enter key
taskInput.addEventListener('keypress', (event) => { // Adds keypress event listener to input
    if (event.key === 'Enter') { // Checks if Enter key was pressed
        addTask(); // Calls addTask function
    }
});
