let indicatorOne = document.getElementById('1')
let indicatorTwo = document.getElementById('2')
let indicatorThree = document.getElementById('3')

document.getElementById('menu-toggle').addEventListener('click', function() {
    var menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
});

indicatorOne.onclick = () => {
    activeAnimation('slide1')
    indicatorOpacity(indicatorOne)
    showImage('slide1')
    removeOnLoadFunction()
}

indicatorTwo.onclick = () => {
    activeAnimation('slide2')
    indicatorOpacity(indicatorTwo)
    showImage('slide2')
    removeOnLoadFunction()
}

indicatorThree.onclick = () => {
    activeAnimation('slide3')
    indicatorOpacity(indicatorThree)
    showImage('slide3')
    removeOnLoadFunction()
}

let shouldRunClickButtons = true;
function removeOnLoadFunction () {
    shouldRunClickButtons = false;
}

function clickButtons() {

    var number = 2

    setInterval(() => { 
        if (!shouldRunClickButtons) return; // Verifica se deve parar

        document.getElementById(`${number}`).click()

        if (number === 3) {
            number = 1
        } else {
            number++
        }
    }, 10000)
}

function showImage(type) {
    let slide = document.getElementById(type)
    let elementWithShowClass = document.getElementsByClassName('show')[0]

    elementWithShowClass.classList.remove('show')

    slide.classList.add('show')
}

function indicatorOpacity(indicator) {
    let indicatorWithHightOpacity = document.getElementsByClassName('high-opacity')[0]
    indicatorWithHightOpacity.classList.remove('high-opacity')
    indicatorWithHightOpacity.classList.add('low-opacity')

    indicator.classList.remove('low-opacity')
    indicator.classList.add('high-opacity')
    
}

function activeAnimation(type) {
    let slide = document.getElementById(type)

    let activeSlide = document.getElementsByClassName('active')[0]
    activeSlide.classList.remove('active') 

    setTimeout(() => {
        slide.classList.add('active');
    }, 10);
}


function fullfillOption(type){
    document.querySelector('#volunteer-informations select#options').value = type
}

function goTo(url) {
    window.location.href = url
}
/* ------------------------------------ */

function rearrangeItems() {
    const items = document.querySelectorAll('.item.to-right');

    items.forEach(item => {
        // Obtém o conteúdo e a imagem
        const content = item.querySelector('.content');
        const img = item.querySelector('img');

        // Remove a imagem e o conteúdo do item
        item.removeChild(content);
        item.removeChild(img);

        // Cria um novo item e anexa o conteúdo e a imagem na ordem desejada
        const newItem = document.createElement('div');
        newItem.classList.add('item', 'to-right');

        newItem.appendChild(img); // Adiciona a imagem depois
        newItem.appendChild(content); // Adiciona o conteúdo primeiro
        

        // Substitui o item original pelo novo
        item.parentNode.replaceChild(newItem, item);
    });
}

// Chama a função ao carregar a página
window.addEventListener('load', () => {
    if (window.innerWidth <= 768) {
        rearrangeItems();
        changeVideoSize()
    }
});

function verifyIfRearrange() {
    if (window.innerWidth <= 768) {
        rearrangeItems();
        changeVideoSize()
    }
}

// Chama a função ao redimensionar a janela
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        rearrangeItems();
        changeVideoSize()
    }
});


function changeVideoSize() {
    document.querySelector('.history-video iframe').setAttribute('width', '100')
    document.querySelector('.history-video iframe').setAttribute('height', '215')
}

function test() {
    window.alert('this is a test')
}