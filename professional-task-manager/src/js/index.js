let taskInput =document.getElementById('task')
let priorityInput =document.getElementById('Priority')
let addButton = document.getElementById('addbtn')
let editButton = document.getElementById('editbtn')
let searchInput = document.getElementById('search')
let taskAlert = document.getElementById('taskAlert');
let editAlert = document.getElementById('editAlert');
let currentFilter = 'btnAll';
let btnAll = document.getElementById('btnAll');
let btnPending = document.getElementById('btnPending');
let btnCompleted = document.getElementById('btnCompleted');
let date = getDynamicDate();
let updatedIndex;
let taskContainer;

if (localStorage.getItem('tasks') == null) {
    taskContainer=[]  
}
else{
    taskContainer = JSON.parse(localStorage.getItem('tasks'))
}

Display()

taskInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        
        if (editButton.style.display === 'block') {
            Update(); 
        } 
        else {
            addTask(); 
        }
    }
});

document.documentElement.addEventListener('click', function(event) {
    if (event.target !== searchInput && searchInput.value.trim() !== '') {
        searchInput.value = ''; 
        Display();              
        
    }
});


const priorityColors = {
    'High': 'priority-high',
    'Medium': 'priority-medium',
    'Low': 'priority-low'
};



function addTask(){
   
if (taskInput.value.trim()==='') {
    taskAlert.style.display = "block"
    return;
}
        editButton.style.display = 'none'
        taskAlert.style.display = "none"
        const priorityLevel = priorityInput.value;
    const task = {
        task:taskInput.value,
        priority:priorityInput.value,
        date :getDynamicDate(),
        colorClass:priorityColors[priorityLevel] || 'priority-low' , 
        status: 'pending'
}
taskContainer.push(task)
Display()
localStorage.setItem('tasks' ,JSON.stringify(taskContainer) )
Clear()
}
addButton.addEventListener('click',addTask)

function Display() {
        taskContainer.sort(function(a, b) {
        if (a.status == 'completed' && b.status != 'completed') {return 1};
        if (a.status != 'completed' && b.status == 'completed') {return -1};
        var weightA = a.priority === 'High'  ? 1 : (a.priority === 'Medium' ? 2 : 3);
        var weightB = b.priority === 'High' ? 1 : (b.priority === 'Medium' ? 2 : 3);
        return weightA - weightB;
    });

let content = ``
for (let  i = 0; i < taskContainer.length; i++) {
    var pValue = taskContainer[i].priority; 
    if (pValue === 'High') {
    colorClass = 'priority-high';    
    } else if (pValue === 'Medium') {
        colorClass = 'priority-medium';  
    } else{
        colorClass = 'priority-low';     
    }

if (taskContainer[i].status == 'completed' && (currentFilter === 'btnAll' || currentFilter === ('btnCompleted'))) {
    
 content += `<ul class="task-list">
                <li class="task-item completed">
            <div class="task-main">
                <i class="fa-regular fa-circle-check" onclick="toggleStatus(${i})"></i>
                <span class="badge-Completed completed">Completed</span>
                <p class="task-text">${taskContainer[i].task}<p>
            </div>
                 <div class="task-meta">
                     <div class="priority-info">
                        Priority <span class="badge">${taskContainer[i].priority}</span>
                    </div>
                     <span class="due-date" id="getDate">Due ${taskContainer[i].date}</span>
                    <div class="task-actions">
                        <button onclick="  setUpdate(${i})" class="icon-btn"><i class="fas fa-pen"></i></button>
                        <button id="deleteBtn" class="icon-btn" onclick="Delete(${i})"><i class="fas fa-trash"></i></button>                   </div>
                </div>
            </li>
 </ul>`
}
else if (taskContainer[i].status != 'completed' && (currentFilter === 'btnAll' || currentFilter === 'btnPending')) {
    content += `<ul class="task-list">
                <li class="task-item">
                <div class="task-main">
                    <i onclick="toggleStatus(${i})" class="fa-regular fa-circle"></i>
                    <span class="badge active">Active</span>
                    <p class="task-text">${taskContainer[i].task}</p>
                </div>
                <div class="task-meta">
                    <div class="priority-info">
                    Priority <span class="badge ${colorClass}">${taskContainer[i].priority}</span>
                </div>
                    <span class="due-date" id="getDate">Due ${taskContainer[i].date}</span>
                <div class="task-actions">
                        <button onclick="  setUpdate(${i})" class="icon-btn"><i class="fas fa-pen"></i></button>
                        <button id="deleteBtn" class="icon-btn" onclick="Delete(${i})"><i class="fas fa-trash"></i></button>                   </div>
                    </div>
            </li>
            </ul>`
        }
            }
        document.getElementById('show').innerHTML = content
                }

function toggleStatus(index) {
    if (taskContainer[index].status == 'pending') {
        taskContainer[index].status = 'completed';
    } else {
        taskContainer[index].status = 'pending';
    }
    localStorage.setItem('tasks', JSON.stringify(taskContainer));
    
    if (searchInput.value.trim() !== '') {
        search();
    } else {
        Display();
    }
}





function setUpdate(i) {
    editAlert.style.display = 'none'
    taskAlert.style.display = "none"
    addButton.style.display = 'none'
    editButton.style.display = 'block'
    updatedIndex = i
    taskInput.value =taskContainer[updatedIndex].task
    priorityInput.value =taskContainer[updatedIndex].priority
    taskInput.focus()
}
function Update() {
if (taskInput.value.trim() == '') {
    editAlert.style.display = "block"
    }  
    else{
        editAlert.style.display = 'none'
        taskAlert.style.display = "none"
        addButton.style.display = 'block'
        editButton.style.display = 'none'

taskContainer[updatedIndex].task = taskInput.value
taskContainer[updatedIndex].priority = priorityInput.value
localStorage.setItem('tasks' , JSON.stringify(taskContainer))
Display()
Clear()
    }
}

editButton.addEventListener('click' , Update)

function Delete(DeletedIndex) {
    taskAlert.style.display = "none"
    editAlert.style.display = "none"
    taskContainer.splice(DeletedIndex , 1)
    localStorage.setItem('tasks' ,JSON.stringify(taskContainer) )
    Display()
}

function Clear(){
    taskInput.value = null
}

function search(term) {
if (searchInput.value==='') {
    Display()
    return;
}

     taskContainer.sort(function(a, b) {
        if (a.status == 'completed' && b.status != 'completed') {return 1};
        if (a.status != 'completed' && b.status == 'completed') {return -1};
        var weightA = a.priority === 'High'  ? 1 : (a.priority === 'Medium' ? 2 : 3);
        var weightB = b.priority === 'High' ? 1 : (b.priority === 'Medium' ? 2 : 3);
        return weightA - weightB;
    });
    var contentt = ``
    var term = searchInput.value
    for (let  i = 0; i < taskContainer.length; i++) {
    if (taskContainer[i].task.toLowerCase().includes(term.toLowerCase()) == true) {

var pValue = taskContainer[i].priority; 

        if (pValue === 'High') {
            colorClass = 'priority-high';    
        } else if (pValue === 'Medium') {
            colorClass = 'priority-medium';  
        } else{
            colorClass = 'priority-low';     
        }

if (taskContainer[i].status == 'completed' && (currentFilter === 'All' || currentFilter === ('btnCompleted'))) {
contentt += `<ul class="task-list">
           <li class="task-item completed">
               <div class="task-main">
                   <i class="fa-regular fa-circle-check" onclick="toggleStatus(${i})"></i>
                    <span class="badge-Completed completed">Completed</span>
                    <p class="task-text">${taskContainer[i].task}</p>
                </div>
                 <div class="task-meta">
                     <div class="priority-info">
                         Priority <span class="badge ${colorClass}">${taskContainer[i].priority}</span>
                    </div>
                     <span class="due-date" id="getDate">Due ${taskContainer[i].date}</span>
                   <div class="task-actions">
                        <button onclick="  setUpdate(${i})" class="icon-btn"><i class="fas fa-pen"></i></button>
                      <button id="deleteBtn" class="icon-btn" onclick="Delete(${i})"><i class="fas fa-trash"></i></button>                   </div>
                </div>
            </li>
 </ul>`
}
else if (taskContainer[i].status != 'completed' && (currentFilter === 'btnAll' || currentFilter === 'btnPending')) {
    contentt += `<ul class="task-list">
           <li class="task-item">
               <div class="task-main">
                    <i onclick="toggleStatus(${i})" class="fa-regular fa-circle"></i>
                    <span class="badge active">Active</span>
                    <p class="task-text">${taskContainer[i].task}</p>
                </div>
                 <div class="task-meta">
                     <div class="priority-info">
                         Priority <span class="badge ${colorClass}">${taskContainer[i].priority}</span>
                    </div>
                     <span class="due-date" id="getDate">Due ${taskContainer[i].date}</span>
                   <div class="task-actions">
                        <button onclick="  setUpdate(${i})" class="icon-btn"><i class="fas fa-pen"></i></button>
                      <button id="deleteBtn" class="icon-btn" onclick="Delete(${i})"><i class="fas fa-trash"></i></button>                   </div>
                </div>
            </li>
 </ul>`
}


    }
    }
document.getElementById('show').innerHTML = contentt
    }

searchInput.addEventListener('input' , search)

function getDynamicDate() {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}




function filterTasks(filterType, clickedButton) {
    currentFilter = filterType;

    btnAll.classList.remove('current');
    btnPending.classList.remove('current');
    btnCompleted.classList.remove('current');
    clickedButton.classList.add('current');

        Display();
    
}

btnAll.addEventListener('click', () => filterTasks('btnAll', btnAll));
btnPending.addEventListener('click', () => filterTasks('btnPending', btnPending));
btnCompleted.addEventListener('click', () => filterTasks('btnCompleted', btnCompleted));