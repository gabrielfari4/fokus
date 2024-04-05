// Segunda versão do script-crud construído de forma diferente, seguindo outra dinâmica 

const btnAdicionarTarefa = document.querySelector('.app__button--add-task')

const formAdicionarTarefa = document.querySelector('.app__form-add-task')
const textArea = document.querySelector('.app__form-textarea')

const ulTarefas = document.querySelector('.app__section-task-list')

const cancelarTarefa = document.querySelector('.app__form-footer__button--cancel')
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description')
const btnRemoverConcluidas = document.getElementById('btn-remover-concluidas')
const btnRemoverTodas = document.getElementById('btn-remover-todas')

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []

let tarefaSelecionada = null
let liTarefaSelecionada = null

const limparForm = () => {
    textArea.value = ''
    formAdicionarTarefa.classList.add('hidden');
}

// Função que atualiza o localStorage passando a lista tarefas com a string tarefas //
function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

// Função que recebe o parâmetro tarefa criado no submit do formTask; cria um elemento li e adiciona uma classe; cria um elemento svg e adiciona um conteúdo html; cria um elemento p, atribui a tarefa.descricao ao textContent e adiciona uma classe; cria um elemento button e adiciona uma classe; cria um elemento img e adiciona um atributo src; insere o img no botao; adiciona um onclick ao botao; insere o svg, o paragrafo e o botao ao li; se a tarefa.completa é true adiciona a class app__section-task-list-item-complete ao li e o atributo disabled ao botao de editar; caso não, adiciona um onclick ao li; retorna o elemento li //
function criarElementoTarefa(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = `
    <svg class="app_section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="12" fill="#FFF" /> <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.17192" fill="#01080E"/> </svg>
    `

    const paragrafo = document.createElement('p')
    paragrafo.textContent = tarefa.descricao
    paragrafo.classList.add('app__section-task-list-item-description')

    const botao = document.createElement('button')
    botao.classList.add('app_button-edit')
    const imagemBotao = document.createElement('img')
    imagemBotao.setAttribute('src', '/imagens/edit.png')
    botao.append(imagemBotao)

    // onclick chama um prompt para o novo nome da tarefa; se o prompt for preenchido muda o paragrafo.textContent para a novaDescricao; tarefa.descricao recebe como value a novaDescricao; atualiza o localStorage //
    botao.onclick = () => {
        const novaDescricao = prompt('Qual é o novo nome da tarefa?')
        if(novaDescricao) {
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao
            atualizarTarefas();
        }
    }

    li.append(svg)
    li.append(paragrafo)
    li.append(botao)

    // Caso a tarefa tenha a propriedade .completa com valor true adiciona a class app__section-task-list-item-complete ao li e adiciona o atributo disabled ao botao do li; caso a tarefa não tenha a propriedade, adiciona o onclick no li //
    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', 'disabled')
    } else {
        // onclick que remove de todos os li a class app__section-task-list-item-active; se a tarefaSelecionada for a própria tarefa limpa o textContent de paragrafoDescricaoTarefa; nulifica tarefaSelecionada e liTarefaSelecionada e termina a função; atribui a tarefa à tarefaSelecionada; atribui o li à liTarefaSelecionada; atribui a tarefa.descricao ao paragrafoDescricaoTarefa.textContent; adiciona a class app__section-task-list-item-active ao li //
        li.onclick = () => {
            //debugger
            document.querySelectorAll('.app__section-task-list-item-active')
            .forEach(elemento => {
                elemento.classList.remove('app__section-task-list-item-active')
            })
    
            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = ''
                tarefaSelecionada = null
                liTarefaSelecionada = null
                return
            }
            tarefaSelecionada = tarefa
            liTarefaSelecionada = li
            paragrafoDescricaoTarefa.textContent = tarefa.descricao
            li.classList.add('app__section-task-list-item-active')
        }
    }

    return li;
}

// Listener de click que abre o form de tarefa e põe focus no textArea //
btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden')
    textArea.focus();
})

// Listener de submit que recebe um evento; previne o comportamento padrão; cria um objeto tarefa com a propriedade descrição e value da textArea; envia a tarefa pro array tarefas; chama a função criarElementoTarefa(tarefa) adicionando a uma const; insere o resultado da const na lista ulTarefas; atualiza o localStorage; limpa o textArea; esconde o form adicionando a class hidden //
formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textArea.value
    }
    tarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
    atualizarTarefas();
    textArea.value = ''
    formAdicionarTarefa.classList.add('hidden')
})

// forEach pra criar cada tarefa e adicionar à lista de elementos ulTarefas //
tarefas.forEach(tarefa => {
   const elementoTarefa = criarElementoTarefa(tarefa);
   ulTarefas.append(elementoTarefa);
})

cancelarTarefa.addEventListener('click', limparForm);

// Listener de TarefaSelecionada que caso haja uma tarefaSelecionada e um liTarefaSelecionada remove a class app__section-task-list-item-active do elemento li; adiciona a class app__section-task-list-item-complete; adiciona o atributo disabled ao button da li; tarefaSelecionada recebe a propriedade .completa com o valor true; atualiza o localStorage //
document.addEventListener('TarefaFinalizada', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})

// Expressão de função que cria uma variável com valor de class a depender do booleano passado como parâmetro; remove cada elemento com a class indicada pela variável; cria um novo array com o filter sem os elementos removidos; atualiza o localStorage //
const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : []
    atualizarTarefas()
}

btnRemoverConcluidas.onclick = () => removerTarefas(true)
btnRemoverTodas.onclick = () => removerTarefas(false)