const musica = [
    { titulo: "Preciso dizer que te amo", artista: "Dona Duarte", genero: "MPB",  audio: "assets/musicas/musica 1.mp3", capa: "assets/capas/capa 1.jpg", fav: true },
    { titulo: "O velho e a Flor",         artista: "Dona Duarte", genero: "MPB",  audio: "assets/musicas/musica 2.mp3", capa: "assets/capas/capa 2.jpg" },
    { titulo: "Cabide",                   artista: "Dona Duarte", genero: "MPB",  audio: "assets/musicas/musica 5.mp3", capa: "assets/capas/capa 5.jpg" },
    { titulo: "O Leaozinho",            artista: "Dona Duarte", genero: "MPB", audio: "assets/musicas/musica 7.mp3", capa: "assets/capas/capa 7.jpg" },
    { titulo: "Hotel California",         artista: "Dona Duarte", genero: "Rock", audio: "assets/musicas/musica 3.mp3", capa: "assets/capas/capa 3.jpg" },
    { titulo: "Still Loving You",         artista: "Dona Duarte", genero: "Rock", audio: "assets/musicas/musica 4.mp3", capa: "assets/capas/capa 4.jpg" },
    { titulo: "Enter Sandman",            artista: "Dona Duarte", genero: "Rock", audio: "assets/musicas/musica 6.mp3", capa: "assets/capas/capa 6.jpg" },
    { titulo: "Ole ole ola",            artista: "Dona Duarte", genero: "Mencao Honrosa", audio: "assets/musicas/musica 8.mp3", capa: "assets/capas/capa 8.jpg" },
];

const $ = (id) => document.getElementById(id);
const audio = $("audio");
const titulo = $("titulo");
const artista = $("artista");
const capa = $("capa");
const vinil = document.querySelector(".vinil");
const botaoPlay = $("play");
const botaoAnterior = $("anterior");
const botaoProxima = $("proximo");
const barraProgresso = $("barra-tempo");
const tempoDecorrido = $("tempo-atual");
const duracaoMusica = $("tempo-total");
const barraVolume = $("barra-volume");
const playlist = $("playlist");

let indice = 0;
let arrastando = false;

// playlist gerada a partir do array
let generoAtual = null;
musica.forEach((m, i) => {
    if (m.genero !== generoAtual) {
        generoAtual = m.genero;
        playlist.insertAdjacentHTML("beforeend", `<div class="genero"><p>${m.genero}</p><hr></div>`);
    }
    const item = document.createElement("div");
    item.className = "musica";
    item.dataset.index = i;
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.innerHTML = `
        <img src="${m.capa}" alt="Capa de ${m.titulo}">
        <div class="info-musica">
            <span class="nome-musica">${m.titulo}</span>
            <span class="nome-artista">${m.artista}</span>
            ${m.fav ? '<span class="fav">Favorita &lt;3</span>' : ""}
        </div>`;
    playlist.appendChild(item);
});
const itensPlaylist = playlist.querySelectorAll(".musica");

function formatarTempo(segundos) {
    if (!isFinite(segundos)) return "0:00";
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min}:${seg < 10 ? "0" : ""}${seg}`;
}

function carregarMusica() {
    const m = musica[indice];
    titulo.textContent = m.titulo;
    artista.textContent = m.artista;
    capa.src = m.capa;
    audio.src = m.audio;
    barraProgresso.value = 0;
    tempoDecorrido.textContent = "0:00";
    duracaoMusica.textContent = "0:00";
    $("faixa-num").textContent = String(indice + 1).padStart(2, "0");
    itensPlaylist.forEach((item, i) => item.classList.toggle("ativa", i === indice));
}

function tocar(i) {
    indice = i;
    carregarMusica();
    audio.play().catch(() => {});
}

const proxima = () => tocar((indice + 1) % musica.length);
const anterior = () => tocar((indice - 1 + musica.length) % musica.length);

// botões e playlist
botaoPlay.addEventListener("click", () => {
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
});
botaoProxima.addEventListener("click", proxima);
botaoAnterior.addEventListener("click", anterior);

itensPlaylist.forEach((item) => {
    const escolher = () => tocar(Number(item.dataset.index));
    item.addEventListener("click", escolher);
    item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            escolher();
        }
    });
});

// a interface segue o estado real do <audio>
audio.addEventListener("play", () => {
    botaoPlay.textContent = "⏸";
    vinil.classList.add("tocando");
});
audio.addEventListener("pause", () => {
    botaoPlay.textContent = "▶";
    vinil.classList.remove("tocando");
});
audio.addEventListener("ended", proxima);

// progresso
audio.addEventListener("loadedmetadata", () => {
    barraProgresso.max = audio.duration;
    duracaoMusica.textContent = formatarTempo(audio.duration);
});
audio.addEventListener("timeupdate", () => {
    if (!arrastando) barraProgresso.value = audio.currentTime;
    tempoDecorrido.textContent = formatarTempo(audio.currentTime);
});
barraProgresso.addEventListener("pointerdown", () => { arrastando = true; });
barraProgresso.addEventListener("pointerup", () => { arrastando = false; });
barraProgresso.addEventListener("change", () => { arrastando = false; });
barraProgresso.addEventListener("input", () => {
    audio.currentTime = barraProgresso.value;
    tempoDecorrido.textContent = formatarTempo(barraProgresso.value);
});

// volume
barraVolume.addEventListener("input", () => {
    audio.volume = barraVolume.value / 100;
});
audio.volume = barraVolume.value / 100;

carregarMusica();

// mensagem inicial: aparece uma vez só
const aviso = $("aviso");
let visto = false;
try { visto = localStorage.getItem("aviso-visto") === "1"; } catch (e) {}
if (!visto) {
    aviso.hidden = false;
    $("aviso-ok").focus();
}
$("aviso-ok").addEventListener("click", () => {
    aviso.hidden = true;
    try { localStorage.setItem("aviso-visto", "1"); } catch (e) {}
});
