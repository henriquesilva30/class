const caixa = document.getElementById('cardAlunos');
//map = new google.maps.Map(document.getElementById("cardAlunos"), {
const nr = document.getElementById('numero');
const foto = document.getElementById('foto');
const nome = document.getElementById('nome');
const curso = document.getElementById('curso');
const obs = document.getElementById('obs');

let alunos = '';

async function getAlunos(){
  if(alunos == ''){
const res = await fetch('./alunos.json');
alunos = await res.json();
  }
}

async function preencherTab(aluno){
  await getAlunos();
  let found = alunos;
  if(aluno != 0)
    found = alunos.filter(element => element.numero.toString().toLowerCase().indexOf(aluno.toString().toLowerCase()) > -1);
    nr.innerHTML = found[0].nome;
    foto.innerHTML = "<img style='width: 200px; padding-left:-1.5rem; height: 250px;' src='"+ found[0].foto +"'/>";
    nome.innerHTML = found[0].numero
    curso.innerHTML = found[0].curso
    obs.innerHTML = found[0].obs
    
}



async function showAlunos(){
   caixa.innerHTML ='';
    alunos.forEach(user => {
    setCard(user);
    });
}


function setCard(user){
  const infoAluno = document.createElement('div');
  const nome = user.nome;
  const curso = user.curso;
  const numero =  user.numero;

  infoAluno.innerHTML = `
    <div class="card border-2 rounded-3 border-dark m-3" onClick="preencherTab(${user.numero})">
    <div class="mw-100 bg-dark">
      <h5 class="card-title mx-3 my-2 text-light">${nome}</h5>
    </div>
    <div class="card-body bg-warning">
      <p class="card-text">${numero}</p>
      <p class="card-text"><small class="text-muted">${curso}</small></p>
    </div>
    </div>
    `;
    caixa.appendChild(infoAluno);

}


async function getMeteorologia() {

  const containerInformacao = document.getElementById('cardAlunos');
  const local = 'Viana do Castelo';
  let localPreenchido;

  // fetch com parâmetros (se necessário)
  let url = new URL('http://api.openweathermap.org/data/2.5/weather');
  const params = {
      q: local,
      units: 'metric',
      lang: 'pt',
      appid: 'b031dfbef55a421b0b29419db8095ec1'
  };
  url.search = new URLSearchParams(params);

  // fetch com headers (se necessário)
  const options = {
      method: 'get',
      headers: {
          "Content-Type": "application/json"
      }
  };

  localPreenchido = false;
  if (local.length > 0) {
      localPreenchido = true;
  }
  if (localPreenchido) {
      containerInformacao.innerHTML = 'A obter informação...';
      try {
          const response = await fetch(url);
          // console.log(response);

          if (!response.ok) {
              if (response.status = 404) {
                  containerInformacao.innerHTML = 'Local não encontrado';
              }
              const message = 'Error with Status Code: ' + response.status;
              throw new Error(message);
          }

          const data = await response.json();
          setCardTempo(data);
      } catch (error) {
          // fetch error handling
          console.log('Error: ' + error);
      }
  } else {
      containerInformacao.innerHTML = 'Preencha, por favor, o local.';
  }
  
}

function setCardTempo(dadosAPI) {
  const div = document.getElementById('cardAlunos');
  const infoTempo = document.createElement('div');
  const nomeLocal = dadosAPI.name;
  const descrTempo = dadosAPI.weather[0].description;
  const icone = 'http://openweathermap.org/img/wn/' + dadosAPI.weather[0].icon + '@2x.png';
  const temperatura = dadosAPI.main.temp + 'ºC';

  div.innerHTML = '';

  infoTempo.innerHTML = `
  <div class="card text-center" style="width: 18rem;">
      <img src="${icone}" class="mx-auto d-block" alt="${nomeLocal}" width="100" height="100">
      <div class="card-body">
          <h5 class="card-title">${nomeLocal}</h5>
          <p class="card-text"><h1>${temperatura}</h1>${descrTempo}</p>
      </div>
  </div>
  `;
  div.appendChild(infoTempo);
}


async function getPTcovid() {
  let url = 'https://corona.dnsforfamily.com/graph.png?c=PT'
  const response = await fetch(url);
  //const data = await response.json();
  const containerCovid = document.getElementById('cardAlunos');
  const infoCovid = document.createElement('div');
  containerCovid.innerHTML = '';
  infoCovid.innerHTML=`<img src="${response.url}" width="100%" height="100%">` 
  console.log(response.url);
  containerCovid.appendChild(infoCovid);
}



let map;
let service;
let infowindow;

function initMap() {
  
  const sydney = new google.maps.LatLng(-8.9016428,41.7179591);

  infowindow = new google.maps.InfoWindow();
  caixa.innerHTML = '';

  map = new google.maps.Map(caixa, {
    center: sydney,
    zoom: 15,
  });

  const request = {
    query: "ESTG",
    fields: ["name", "geometry"],
  };
  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    }
  });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

function setEvents () {
    const btn = document.getElementById('obterAlunos');
    btn.addEventListener('click', () => showAlunos());
    const btnMet = document.getElementById('obterInformacaoMeteorologia');
    btnMet.addEventListener('click', () => getMeteorologia());
    const btnCovid = document.getElementById('obterInformacaoCovid');
    btnCovid.addEventListener('click', () => getPTcovid()); 
    const btnLocal = document.getElementById('obterLocal');
    btnLocal.addEventListener('click', () => initMap());
  
}

document.addEventListener('DOMContentLoaded', () => {
    setEvents();
    preencherTab(0);
    caixa.innerHTML = '';
});
