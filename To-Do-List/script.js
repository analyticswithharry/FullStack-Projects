// Select DOM elements
const taskInput = document.getElementById('taskInput'); // Gets input for task text
const priorityInput = document.getElementById('priorityInput'); // Gets dropdown for priority
const dueDateInput = document.getElementById('dueDateInput'); // Gets input for due date
const categoryInput = document.getElementById('categoryInput'); // Gets dropdown for category
const taskList = document.getElementById('taskList'); // Gets ul for tasks
const error = document.getElementById('error'); // Gets error message paragraph
const taskCount = document.getElementById('taskCount'); // Gets span for total tasks
const completedCount = document.getElementById('completedCount'); // Gets span for completed tasks
const priorityFilter = document.getElementById('priorityFilter'); // Gets dropdown for priority filter

// Initialize chart
let taskChart = new Chart(document.getElementById('taskChart'), { // Creates a Chart.js pie chart
    type: 'pie', // Sets chart type to pie
    data: { // Defines chart data
        labels: ['Active', 'Completed'], // Labels for chart segments
        datasets: [{ // Chart dataset
            data: [0, 0], // Initial data (active, completed)
            backgroundColor: ['#3b82f6', '#22c55e'], // Colors for segments
            borderColor: '#fff', // White border between segments
            borderWidth: 2 // Border width
        }]
    },
    options: { // Chart options
        responsive: true, // Makes chart responsive
        plugins: { // Plugin settings
            legend: { // Legend settings
                position: 'top' // Places legend at top
            }
        }
    }
});

// Load tasks from localStorage
document.addEventListener('DOMContentLoaded', () => { // Runs when DOM is fully loaded
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Gets tasks from localStorage or empty array
    tasks.forEach(task => renderTask(task)); // Renders each saved task
    updateStatsAndChart(); // Updates stats and chart
});

// Add task function
function addTask() { // Defines function to add a task
    const text = taskInput.value.trim(); // Gets and trims task text
    const priority = priorityInput.value; // Gets selected priority
    const dueDate = dueDateInput.value; // Gets selected due date
    const category = categoryInput.value; // Gets selected category
    const today = new Date().toISOString().split('T')[0]; // Gets today’s date in YYYY-MM-DD format
    if (text === '') { // Checks for empty text
        showError('Please enter a task!'); // Shows error message
        return; // Exits function
    }
    if (text.length > 100) { // Checks for text length
        showError('Task is too long (max 100 characters)!'); // Shows error
        return; // Exits function
    }
    if (dueDate && dueDate < today) { // Checks for past due date
        showError('Due date cannot be in the past!'); // Shows error
        return; // Exits function
    }
    const task = { text, priority, dueDate, category, completed: false }; // Creates task object
    renderTask(task); // Renders task to DOM
    saveTask(task); // Saves task to localStorage
    taskInput.value = ''; // Clears text input
    dueDateInput.value = ''; // Clears due date input
    updateStatsAndChart(); // Updates stats and chart
    filterTasksByPriority(); // Reapplies filters
}

// Show error message
function showError(message) { // Defines function to show error
    error.textContent = message; // Sets error text
    error.classList.remove('hidden'); // Shows error
    setTimeout(() => { // Hides error after 2 seconds
        error.classList.add('hidden'); // Adds hidden class
    }, 2000);
}

// Render a task to the DOM
function renderTask(task) { // Defines function to render a task
    const li = document.createElement('li'); // Creates new li element
    li.classList.add(task.priority); // Adds priority class (low, medium, high)
    if (task.completed) { // Checks if task is completed
        li.classList.add('completed'); // Adds completed class
    }
    li.innerHTML = ` <!-- Sets li content with task details and buttons -->
        <div class="task-details"> <!-- Groups task text and metadata -->
            <span onclick="toggleTask(this)">${task.text}</span> <!-- Task text, clickable to toggle -->
            <div class="task-meta"> <!-- Metadata container -->
                ${task.dueDate ? `Due: ${task.dueDate}` : ''} <!-- Shows due date if set -->
                ${task.dueDate && task.category ? ' | ' : ''} <!-- Separator if both exist -->
                ${task.category ? `Category: ${task.category}` : ''} <!-- Shows category if set -->
            </div> <!-- Closes task-meta -->
        </div> <!-- Closes task-details -->
        <div> <!-- Groups buttons -->
            <button class="edit-btn" onclick="editTask(this)">Edit</button> <!-- Edit button -->
            <button class="delete-btn" onclick="deleteTask(this)">Delete</button> <!-- Delete button -->
        </div> <!-- Closes button group -->
    `;
    taskList.appendChild(li); // Adds li to task list
}

// Save task to localStorage
function saveTask(task) { // Defines function to save task
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Gets tasks or empty array
    tasks.push(task); // Adds new task
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Saves to localStorage
}

// Toggle task completion
function toggleTask(span) { // Defines function to toggle completion
    const li = span.parentElement.parentElement; // Gets parent li
    li.classList.toggle('completed'); // Toggles completed class
    updateTaskInStorage(span.textContent, li.classList.contains('completed')); // Updates storage
    updateStatsAndChart(); // Updates stats and chart
    filterTasksByPriority(); // Reapplies filters
}

// Edit task
function editTask(button) { // Defines function to edit task
    const li = button.parentElement.parentElement; // Gets parent li
    const span = li.querySelector('span'); // Gets task text span
    const currentText = span.textContent; // Gets current text
    const currentPriority = li.classList.contains('low') ? 'low' : li.classList.contains('medium') ? 'medium' : 'high'; // Gets current priority
    const currentDueDate = li.querySelector('.task-meta').textContent.includes('Due') ? 
        li.querySelector('.task-meta').textContent.split('Due: ')[1].split(' | ')[0] : ''; // Gets current due date
    const currentCategory = li.querySelector('.task-meta').textContent.includes('Category') ? 
        li.querySelector('.task-meta').textContent.split('Category: ')[1] : ''; // Gets current category
    const newText = prompt('Edit task:', currentText); // Prompts for new text
    if (!newText || newText.trim() === '') return; // Exits if invalid input
    const newPriority = prompt('Enter priority (low, medium, high):', currentPriority); // Prompts for new priority
    const newDueDate = prompt('Enter due date (YYYY-MM-DD):', currentDueDate); // Prompts for new due date
    const newCategory = prompt('Enter category (Work, Personal, Other):', currentCategory); // Prompts for new category
    const today = new Date().toISOString().split('T')[0]; // Gets today’s date
    if (newDueDate && newDueDate < today) { // Checks for past due date
        showError('Due date cannot be in the past!'); // Shows error
        return; // Exits function
    }
    removeTaskFromStorage(currentText); // Removes old task
    li.remove(); // Removes old li
    const task = { // Creates new task object
        text: newText.trim(), // Uses trimmed new text
        priority: ['low', 'medium', 'high'].includes(newPriority) ? newPriority : currentPriority, // Validates priority
        dueDate: newDueDate || currentDueDate, // Uses new or old due date
        category: ['Work', 'Personal', 'Other'].includes(newCategory) ? newCategory : currentCategory, // Validates category
        completed: li.classList.contains('completed') // Retains completion status
    };
    renderTask(task); // Renders updated task
    saveTask(task); // Saves updated task
    updateStatsAndChart(); // Updates stats and chart
    filterTasksByPriority(); // Reapplies filters
}

// Update task in localStorage
function updateTaskInStorage(text, completed) { // Defines function to update task
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Gets tasks
    const updatedTasks = tasks.map(task => task.text === text ? { ...task, completed } : task); // Updates completion
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Saves tasks
}

// Delete task
function deleteTask(button) { // Defines function to delete task
    const text = button.parentElement.querySelector('span').textContent; // Gets task text
    button.parentElement.parentElement.remove(); // Removes parent li
    removeTaskFromStorage(text); // Removes from storage
    updateStatsAndChart(); // Updates stats and chart
    filterTasksByPriority(); // Reapplies filters
}

// Remove task from localStorage
function removeTaskFromStorage(text) { // Defines function to remove task
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Gets tasks
    const updatedTasks = tasks.filter(task => task.text !== text); // Filters out task
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Saves tasks
}

// Clear all tasks
function clearAllTasks() { // Defines function to clear tasks
    taskList.innerHTML = ''; // Clears DOM task list
    localStorage.removeItem('tasks'); // Clears localStorage
    updateStatsAndChart(); // Updates stats and chart
    priorityFilter.value = 'all'; // Resets priority filter
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active')); // Removes active class from filters
    document.querySelector('.filter-btn[onclick="filterTasks(\'all\')"]').classList.add('active'); // Sets All filter active
}

// Update stats and chart
function updateStatsAndChart() { // Defines function to update stats and chart
    const tasks = taskList.children.length; // Counts total tasks
    const completed = taskList.querySelectorAll('.completed').length; // Counts completed tasks
    taskCount.textContent = `Tasks: ${tasks}`; // Updates task count
    completedCount.textContent = `Completed: ${completed}`; // Updates completed count
    taskChart.data.datasets[0].data = [tasks - completed, completed]; // Updates chart data
    taskChart.update(); // Refreshes chart
}

// Filter tasks by status
function filterTasks(status) { // Defines function to filter tasks
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active')); // Removes active class
    document.querySelector(`.filter-btn[onclick="filterTasks('${status}')"]`).classList.add('active'); // Sets active filter
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Gets tasks
    taskList.innerHTML = ''; // Clears task list
    tasks.forEach(task => { // Loops through tasks
        if (status === 'all' || 
            (status === 'active' && !task.completed) || 
            (status === 'completed' && task.completed)) { // Checks status filter
            if (priorityFilter.value === 'all' || task.priority === priorityFilter.value) { // Checks priority filter
                renderTask(task); // Renders matching tasks
            }
        }
    });
    updateStatsAndChart(); // Updates stats and chart
}

// Filter tasks by priority
function filterTasksByPriority() { // Defines function to filter by priority
    const status = document.querySelector('.filter-btn.active').getAttribute('onclick').match(/'([^']+)'/)[1]; // Gets current status filter
    filterTasks(status); // Reapplies status filter with priority
}

// Add task on Enter key
taskInput.addEventListener('keypress', (event) => { // Adds keypress listener to input
    if (event.key === 'Enter') { // Checks for Enter key
        addTask(); // Calls addTask
    }
});
