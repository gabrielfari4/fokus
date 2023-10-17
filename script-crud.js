const taskListContainer = document.querySelector('.app__section-task-list');
const formTask = document.querySelector('.app__form-add-task');
const toggleFormTaskBtn = document.querySelector('.app__button--add-task');
const formLabel = document.querySelector('.app__form-label');
const textArea = document.querySelector('.app__form-textarea');
const taskIconSvg = '<svg class="app_section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="12" fill="#FFF" /> <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.17192" fill="#01080E"/> </svg>'
const closeForm = document.querySelector('.app__form-footer__button--cancel');
const deleteTask = document.querySelector('.app__form-footer__button--delete');
const clearForm = () => {
    taskToEdit = null;
    paragraphToEdit = null;
    textArea.value = "";
}
const localStorageTasks = localStorage.getItem('tarefas');
const activeTaskDescription = document.querySelector('.app__section-active-task-description');
const deleteFinished = document.getElementById('btn-remover-concluidas');
const deleteAll = document.getElementById('btn-remover-todas');

let tarefas = localStorageTasks ? JSON.parse(localStorageTasks) : []

let selectedTask = null;
let selectedTaskItem = null;

let taskToEdit = null;
let paragraphToEdit = null;

const selectingTaskToEdit = (tarefa, elemento) => {
    if (taskToEdit == tarefa) {
        clearForm();
        return
    }

    formLabel.textContent = "Editando tarefa"
    taskToEdit = tarefa
    paragraphToEdit = elemento
    textArea.value = tarefa.descricao
    formTask.classList.remove('hidden')
}

const selectTask = (tarefa, elemento) => {
    if (tarefa.concluida) {
        return
    }

    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('app__section-task-list-item-active');
    })
    
    if (selectedTask == tarefa) {
        activeTaskDescription.textContent = null
        selectedTaskItem = null
        selectedTask = null
        return
    }

    selectedTask = tarefa
    selectedTaskItem = elemento
    activeTaskDescription.textContent = tarefa.descricao
    elemento.classList.add('app__section-task-list-item-active')
}

function createTask(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svgIcon = document.createElement('svg')
    svgIcon.innerHTML = taskIconSvg

    const paragraph = document.createElement('p')
    paragraph.classList.add('app__section-task-list-item-description')

    paragraph.textContent = tarefa.descricao

    const button = document.createElement('button')

    button.classList.add('app_button-edit')
    const editIcon = document.createElement('img')
    editIcon.setAttribute('src', '/imagens/edit.png')

    button.appendChild(editIcon)

    button.addEventListener('click', (event) => {
        event.stopPropagation();
        selectingTaskToEdit(tarefa, paragraph)
    })

    li.onclick = () => {
        selectTask(tarefa, li);
    }

    svgIcon.addEventListener('click', (event) => {
        if (tarefa == selectedTask) {
            event.stopPropagation()
            button.setAttribute('disabled', true)
            li.classList.add('app__section-task-list-item-complete')
            selectedTask.concluida = true
            updateLocalStorage();
        }
        
    })

    if (tarefa.concluida) {
        button.setAttribute('disabled', true)
        li.classList.add('app__section-task-list-item-complete')
    }

    
    li.appendChild(svgIcon)
    li.appendChild(paragraph)
    li.appendChild(button)

    return li
}

tarefas.forEach(task => {
    const taskItem = createTask(task)
    taskListContainer.appendChild(taskItem)
})

toggleFormTaskBtn.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando tarefa'
    formTask.classList.toggle('hidden')
    
    textArea.focus();
})

const updateLocalStorage = () => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

formTask.addEventListener('submit', (evento) => {
    evento.preventDefault()
    if (taskToEdit) {
        taskToEdit.descricao = textArea.value
        paragraphToEdit.textContent = textArea.value
    } else {
        const task = {
            descricao: textArea.value,
            concluida: false
        }
        tarefas.push(task)
        const taskItem = createTask(task)
        taskListContainer.appendChild(taskItem)
        
    }
    updateLocalStorage();
    clearForm();
    textArea.focus();
})

closeForm.addEventListener('click', () => {
    formTask.classList.add('hidden')
    clearForm()
})

deleteTask.addEventListener('click', () => {
    if (selectedTask) {
        const index = tarefas.indexOf(selectedTask)

        if(index !== -1) {
           tarefas.splice(index, 1) 
        }

        selectedTaskItem.remove()
        tarefas.filter(t => t != selectedTask)
        selectedTaskItem = null
        selectedTask = null
    }
    updateLocalStorage()
    clearForm()
})

document.addEventListener('TarefaFinalizada', function (e) {
    if(selectedTask) {
        selectedTask.concluida = true
        selectedTaskItem.classList.add('app__section-task-list-item-complete')
        selectedTaskItem.querySelector('button').setAttribute('disabled', true)
        updateLocalStorage();
    }
})

/* deleteAll.addEventListener('click', () => {
    tarefas = [];
    const childNodes = taskListContainer.childNodes
    taskListContainer.remove(childNodes);
    updateLocalStorage();

}) */

const removeTasks = (finishedTasks) => {
    const seletor = finishedTasks ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach((element) => {
        element.remove();
    });

    tarefas = finishedTasks ? tarefas.filter(t => !t.concluida) : []
    updateLocalStorage()
}

deleteFinished.addEventListener('click', () => removeTasks(true))
deleteAll.addEventListener('click', () => removeTasks(false))