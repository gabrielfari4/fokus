const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');

const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
musica.loop = true;

const startPauseBt = document.querySelector('#start-pause');
const iniciarPausarBt = document.querySelector('#start-pause span')
const iconePlayPause = document.querySelector('.app__card-primary-button-icon')

const tempoTela = document.querySelector('#timer');

let tempoDecorrido = 1500
let intervaloId = null

const play = new Audio('/sons/play.wav');
const pause = new Audio('/sons/pause.mp3');
const beep = new Audio('/sons/beep.mp3');



// Listener de change que dá play ou pausa a música conforme acionado 
musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play()
    } else {
        musica.pause()
    }
})

// Listener de click que altera o valor de tempoDecorrido, chama a função alterarContexto e deixa o botão "ativo"
focoBt.addEventListener('click', () => {
    tempoDecorrido = 1500
    alterarContexto('foco')
    focoBt.classList.add('active')
})

curtoBt.addEventListener('click', () => {
    tempoDecorrido = 300
    alterarContexto('descanso-curto')
    curtoBt.classList.add('active')
})

longoBt.addEventListener('click', () => {
    tempoDecorrido = 900
    alterarContexto('descanso-longo')
    longoBt.classList.add('active')
})

// Função que recebe de argumento uma string; chama a função que altera e exibe o tempo em tela; retira a classe active de todos os botões; altera o data-contexto conforme parâmetro, trocando a cor de fundo; troca a imagem conforme parâmetro; troca o texto conforme parâmetro
function alterarContexto (contexto) {
    mostrarTempo();
    botoes.forEach(function (botao) {
        botao.classList.remove('active')
    })
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`)
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`            
            break;
        case 'descanso-curto':
            titulo.innerHTML = `Que tal dar uma respirada?<br>
            <strong class="app__title-strong">Faça uma pausa curta!</strong>`                    
            break;
        case 'descanso-longo':
            titulo.innerHTML = `Hora de voltar à superfície.<br>
            <strong class="app__title-strong">
            Faça uma pausa longa.</strong>`            
            break;
        default:
            break;
    }
}

// Expressão de função que quando chamada, caso o tempoDecorrido seja <= 0 emite o efeito sonoro, o alerta, chama a função zerarInterval() e armazena um booleano na const focoAtivo; caso o booleano seja true
const contagemRegressiva = () => {
    if (tempoDecorrido <= 0) {
        //beep.play()
        alert("Tempo finalizado!")
        zerarInterval()
        const focoAtivo = html.getAttribute('data-contexto') === 'foco'
        if (focoAtivo) {            
            var event = new CustomEvent("TarefaFinalizada", {
                detail: {
                    message: "A tarefa foi concluída com sucesso!",
                    time: new Date(),
                },
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
            tempoDecorrido = 1500
            mostrarTempo()
        }
        
        return
        
    }
    tempoDecorrido -= 1
    mostrarTempo();
}

// Listener de click que inicia ou pausa o tempo //
startPauseBt.addEventListener('click', iniciarOuPausar)

// Função que quando chamada, caso intervaloId tenha algum valor, dá play no som pause e chama a função zerarInterval(); atribui o setInterval à variável de controle intervaloId; dá play no som play; troca o texto e o icon do botão iniciarPausarBt //
function iniciarOuPausar() {
    
    if(intervaloId) {
        pause.play()
        zerarInterval()
        return
    }
    intervaloId = setInterval(contagemRegressiva, 1000)
    play.play()
    iniciarPausarBt.textContent = "Pausar"
    iconePlayPause.setAttribute('src', '/imagens/pause.png')
}

// Função que chama o método global clearInterval que cancela uma ação estabelecida previamente por um setInterval; troca o texto e o icon do botão iniciarPausarBt; setta o intervaloId pra null novamente //
function zerarInterval () {
    clearInterval(intervaloId)
    iniciarPausarBt.textContent = "Começar"
    iconePlayPause.setAttribute('src', '/imagens/play_arrow.png')
    intervaloId = null
    
}

// Função que pega informação do tempoDecorrido, faz o cálculo, converte pra mm:ss e exibe na tela //
function mostrarTempo() {
    const tempo = new Date(tempoDecorrido * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'})
    tempoTela.innerHTML = `${tempoFormatado}`
}

mostrarTempo();