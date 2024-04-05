const taskListContainer = document.querySelector('.app__section-task-list');

const taskIconSvg2 = '<svg class="app_section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="12" fill="#FFF" /> <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.17192" fill="#01080E"/> </svg>'
const taskIconSvg = '<svg class="app_section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="12" fill="#FFF" /> <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.17192" fill=""/> </svg>'

const formTask = document.querySelector('.app__form-add-task');
const toggleFormTaskBtn = document.querySelector('.app__button--add-task');
const formLabel = document.querySelector('.app__form-label');
const textArea = document.querySelector('.app__form-textarea');

const closeForm = document.querySelector('.app__form-footer__button--cancel');
const deleteTask = document.querySelector('.app__form-footer__button--delete');

const localStorageTasks = localStorage.getItem('tasks');
let tasks = localStorageTasks ? JSON.parse(localStorageTasks) : []

const activeTaskDescription = document.querySelector('.app__section-active-task-description');

const deleteFinished = document.getElementById('btn-remover-concluidas');
const deleteAll = document.getElementById('btn-remover-todas');


let selectedTask = null;
let selectedTaskItem = null;

let taskToEdit = null;
let paragraphToEdit = null;

// Expressão de função que nulifica o taskToEdit; nulifica o paragraphToEdit; limpa o textArea do form //
const clearForm = () => {
    taskToEdit = null;
    paragraphToEdit = null;
    textArea.value = "";
}

// Expressão de função que caso a taskToEdit seja a própria task, chama o clearForm() e termina a função; troca o texto do formLabel; atribui à taskToEdit a task; atribui ao paragraphToEdit o elemento; mostra no textArea a text.descricao; mostra o formTask retirando a class hidden // 
const selectingTaskToEdit = (task, elemento) => {
    if (taskToEdit == task) {
        clearForm();
        return
    }

    formLabel.textContent = "Editando tarefa"
    taskToEdit = task
    paragraphToEdit = elemento
    textArea.value = task.descricao
    formTask.classList.remove('hidden')
}

// Expressão de função que recebe a task criada no form e o elemento li criado na createTask(); se a task.concluida estiver true a função termina; remove de todos os itens a class app__section-task-list-item-active; se a selectedTask corresponder a task já selecionada o activeTaskDescription é nulificado, assim como o selectedTaskItem e o selectedTask e a função termina; atribui à variável selectedTask a task criada no submit do formTask; atribui à variável selectedTaskItem o elemento li criado no createTask(); atribui ao activeTaskDescription o value task.descricao e adiciona ao elemento li a class app__section-task-list-item-active //
const selectTask = (task, elemento) => {
    if (task.concluida) {
        return
    }

    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (item) {
        item.classList.remove('app__section-task-list-item-active');
    })
    
    if (selectedTask == task) {
        activeTaskDescription.textContent = null
        selectedTaskItem = null
        selectedTask = null
        return
    }

    selectedTask = task
    selectedTaskItem = elemento
    activeTaskDescription.textContent = task.descricao
    elemento.classList.add('app__section-task-list-item-active')
}

// Função que recebe o parâmetro task criado no submit do formTask; cria um elemento li e adiciona classe; cria um elemento svg e insere o valor taskIconSvg; cria um elemento p e adiciona classe; insere o valor task.descricao ao p; cria um elemento button e adiciona classe; cria um elemento img e adiciona um valor ao atributo src; insere o elemento img de lápis no elemento button; adiciona um listener no button; clicar no li chama a função selectTask(task, li); adiciona um listener no svgIcon; se a task.concluida estiver true troca o icon pro check; adiciona o atributo disabled com value true no button; adiciona a class app__section-task-list-item-complete no elemento; insere o svgIcon no elemento li; adiciona o paragraph no elemento li; adiciona o button no elemento li; retorna o li criado //
function createTask(task) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svgIcon = document.createElement('svg')
    svgIcon.innerHTML = taskIconSvg

    const paragraph = document.createElement('p')
    paragraph.classList.add('app__section-task-list-item-description')
    paragraph.textContent = task.descricao

    const button = document.createElement('button')
    button.classList.add('app__button-edit')
    const editIcon = document.createElement('img')
    editIcon.setAttribute('src', '/imagens/edit.png')
    button.appendChild(editIcon)

    // Listener de click que impede a propagação do click; chama a função selectingTaskToEdit(task, paragraph) //
    button.addEventListener('click', (event) => {
        event.stopPropagation();
        selectingTaskToEdit(task, paragraph)
    })

    li.onclick = () => {
        selectTask(task, li);
    }

    // Listener de click que se a task estiver selecionada (selectedTask) faz: impede a propagação do click; troca o icon pro check; limpa o campo activeTaskDescription de task em andamento; adiciona o atributo disabled com value true no button; adiciona a class app__section-task-list-item-complete no elemento; torna a selectedTask.concluida true; atualiza o localStorage //
    svgIcon.addEventListener('click', (event) => {
        if (task == selectedTask) {
            event.stopPropagation()
            svgIcon.innerHTML = taskIconSvg2
            activeTaskDescription.textContent = null
            button.setAttribute('disabled', true)
            li.classList.add('app__section-task-list-item-complete')
            selectedTask.concluida = true
            updateLocalStorage();
        }
        
    })

    if (task.concluida) {
        svgIcon.innerHTML = taskIconSvg2
        button.setAttribute('disabled', 'disabled')
        li.classList.add('app__section-task-list-item-complete')
    }

    
    li.appendChild(svgIcon)
    li.appendChild(paragraph)
    li.appendChild(button)

    return li
}

// forEach que aplica a função pra cada li do array tasks e insere na ul taskListContainer //
tasks.forEach(task => {
    const taskItem = createTask(task)
    taskListContainer.appendChild(taskItem)
})

// Listener de click que insere o texto no label do form e exibe o form retirando a class hidden do elemento; focus no textArea do form //
toggleFormTaskBtn.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando tarefa'
    formTask.classList.toggle('hidden')
    
    textArea.focus();
})

// Expressão de função que envia para o localStorage os itens do array tasks //
const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Listener de submit que previne o comportamento padrão; se a textArea.value for vazio ou apenas um espaço a função termina; se a taskToEdit tem um valor (uma task selecionada) a taskToEdit recebe o valor da textArea e o paragraphToEdit recebe o valor da textArea; caso não tenha taskToEdit: cria um objeto task com propriedade descrição recebendo o valor digitado em textArea e concluída recebendo false; envia o objeto task para o array tasks; cria uma const chamando o createTask que vai criar um elemento tarefa com as propriedades do objeto task criado; insere na ul taskListContainer o elemento criado; chama a função updateLocalStorage(); chama a função clearForm(); coloca o foco no textArea //
formTask.addEventListener('submit', (evento) => {
    evento.preventDefault()
    if (textArea.value === ' ') {
        return
    }
    if (taskToEdit) {
        taskToEdit.descricao = textArea.value
        paragraphToEdit.textContent = textArea.value
        formTask.classList.toggle('hidden')
    } else {
        const task = {
            descricao: textArea.value,
            concluida: false
        }
        tasks.push(task)
        const taskItem = createTask(task)
        taskListContainer.appendChild(taskItem)
        
    }
    updateLocalStorage();
    clearForm();
    textArea.focus();
})

// Listener de click que esconde o form adicionando a class hidden; chama a função clearForm() //
closeForm.addEventListener('click', () => {
    formTask.classList.add('hidden')
    clearForm()
})

// Listener de click que se tiver selectedTask pega o index do selectedTask; caso o index seja diferente de -1 a task é retirada do array; remove o elemento selectedTaskItem do DOM; cria um novo array sem a task recém removida; nulifica o selectedTaskItem e o selectedTask; atualiza o localStorage; chama o clearForm() //
deleteTask.addEventListener('click', () => {
    if (selectedTask) {
        const index = tasks.indexOf(selectedTask)

        if(index !== -1) {
           tasks.splice(index, 1) 
        }

        selectedTaskItem.remove()
        tasks.filter(t => t != selectedTask)
        selectedTaskItem = null
        selectedTask = null
    }
    updateLocalStorage()
    clearForm()
})

// Listener de TarefaFinalizada, com função de: caso haja uma selectedTask a selectedTask.concluida se torna true; o selectedTaskItem recebe a class app__section-task-list-item-complete; o button recebe o atributo disabled como true; atualiza o localStorage //
document.addEventListener('TarefaFinalizada', function (e) {
    if(selectedTask) {
        selectedTaskItem.querySelector('svg').innerHTML = taskIconSvg2
        selectedTask.concluida = true
        selectedTaskItem.classList.add('app__section-task-list-item-complete')
        selectedTaskItem.querySelector('button').setAttribute('disabled', 'disabled')
        updateLocalStorage();
    }
})

// Expressão de função que recebe um argumento booleano; cria uma variável que recebe string com classes diferentes conforme o booleano; remove todos os elementos com a class da variável criada; o array tasks recebe conforme o booleano um novo array; atualiza o localStorage //
const removeTasks = (finishedTasks) => {
    const seletor = finishedTasks ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach((element) => {
        element.remove();
    });

    tasks = finishedTasks ? tasks.filter(t => !t.concluida) : []
    updateLocalStorage()
}

deleteFinished.addEventListener('click', () => removeTasks(true))
deleteAll.addEventListener('click', () => removeTasks(false))