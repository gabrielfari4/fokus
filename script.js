const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const musicaFocoInput = document.querySelector('#alternar-musica');
const iniciarPausarBt = document.querySelector('#start-pause span')
const iconePlayPause = document.querySelector('.app__card-primary-butto-icon')
const tempoTela = document.querySelector('#timer');

const musica = new Audio('/sons/luna-rise-part-one.mp3');
const play = new Audio('/sons/play.wav');
const pause = new Audio('/sons/pause.mp3');
const beep = new Audio('/sons/beep.mp3');

let tempoDecorrido = 3
let intervaloId = null

musica.loop = true;

musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play()
    } else {
        musica.pause()
    }
})

focoBt.addEventListener('click', () => {
    tempoDecorrido = 3
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

const contagemRegressiva = () => {
    if (tempoDecorrido <= 0) {
        beep.play()
        alert("Tempo finalizado!")
        zerar()
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
            tempoDecorrido = 3
            mostrarTempo()
        }
        
        return
        
    }
    tempoDecorrido -= 1
    mostrarTempo();
}

startPauseBt.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar() {
    
    if(intervaloId) {
        pause.play()
        zerar()
        return
    }
    intervaloId = setInterval(contagemRegressiva, 1000)
    play.play()
    iniciarPausarBt.textContent = "Pausar"
    iconePlayPause.setAttribute('src', '/imagens/pause.png')
}

function zerar () {
    clearInterval(intervaloId)
    iniciarPausarBt.textContent = "Começar"
    iconePlayPause.setAttribute('src', '/imagens/play_arrow.png')
    intervaloId = null
    
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorrido * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'})
    tempoTela.innerHTML = `${tempoFormatado}`
}

mostrarTempo();