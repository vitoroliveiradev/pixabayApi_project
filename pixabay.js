'use strict';

// Função que vai consumir a api 3.
const searchImages = async text => {
    const key = "25252316-c5c3cd0ff35c62708c8cd50ba";
    const url = `https://pixabay.com/api/?key=${key}&q=${text}`;
    const response = await fetch(url);
    return response.json();
};

const createLink = tag => `
    <a href="#" onclick="loadGallery('${tag}')">
        ${tag}
    </a>
`

const createCard = ( { webformatURL, pageURL, tags, likes, comments } ) => {
    const card = document.createElement("div");
    card.classList.add("card-container");
    card.innerHTML = `
        <a href="${pageURL}" class="card-image" target="_blank">
            <img src="${webformatURL}" />
        </a>
        <div class="card-info">
            <div class="card-tags">
                ${tags.split(",").map(createLink).join("")}
            </div>

            <div class="card-action">
                <div class="card-like">
                    <i class="far fa-thumbs-up"></i>
                    <span>${likes}</span>
                </div>
                <div class="card-comment">
                    <i class="far fa-comment"></i>
                    <span>${comments}</span>
                </div>
                <div class="card-save">
                    <i class="far fa-bookmark"></i>
                </div>
            </div>
        </div>
    `;
    return card;
}

// Vai receber o valor digitado dentro da caixa. Tem como responsabilidade renderizar a galeria na tela 2.
const loadGallery = async (text, page = 1) => {
    const container = document.querySelector(".container-gallery");
    const {hits, totalHits} = await searchImages(`${text}&page=${page}`);
    const cards = hits.map(createCard)
    container.replaceChildren(...cards);
    
    const totalPages = Math.ceil(totalHits / 20);
    document.querySelector("#page-total").textContent = `/ ${totalPages}`
    document.querySelector("#search-input").value = text;
    document.querySelector("#page").value = page;
};

// Função que verifica que somente ocorre o resto se for pressionado a tecla Enter.
// E também passa o texto digitado no input como parâmetro para a função loadGallery.
// 1
const handleKeypress = ( { key, target } ) => {
    if(key == "Enter") {
        loadGallery(target.value);
    }
};

const handlePage = ({key, target}) => {
    const text = document.querySelector("#search-input").value;
    if(key == "Enter") {
        loadGallery(text, target.value)
    }
}

const handleNext = () => {
    let page = Number(document.querySelector("#page").value);
    const totalPages = Number(document.querySelector("#page-total").textContent.replace("/", ""));
    const text = document.querySelector("#search-input").value;
    if( page < totalPages) {
        page++;
        loadGallery(text, page)
    }
};

const handlePrevious = () => {
    let page = Number(document.querySelector("#page").value);
    const text = document.querySelector("#search-input").value;
    if( page > 1) {
        page--;
        loadGallery(text, page)
    }
};

// Capturando o enter dentro do input.

document.querySelector("#search-input")
    .addEventListener("keypress", handleKeypress);
document.querySelector("#page")
    .addEventListener("keypress", handlePage)
document.querySelector("#page-next")
    .addEventListener("click", handleNext)
document.querySelector("#page-previous")
    .addEventListener("click", handlePrevious)