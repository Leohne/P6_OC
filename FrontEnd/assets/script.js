const gallery = document.querySelector(".gallery")
const category = document.querySelector(".filtre")

const allWorks = new Set()
const allCats = new Set()

async function init() {
    const works = await getDatabaseInfo("works")
    const cats = await getDatabaseInfo("categories")
    for (const work of works) {
        allWorks.add(work)
    }
    for (const cat of cats) {
        allCats.add(cat)
    }
    displayWorks(allWorks)
    displayCats()
}
init()

async function getDatabaseInfo(type) {
    const response = await fetch("http://localhost:5678/api/"+type)
    if (response.ok) {
        return response.json()
    } else {
        console.log(response.error);
    }
}

async function displayWorks(works) {
    gallery.innerHTML = ""
    const fragment = document.createDocumentFragment()
    
    for (const work of works) {
        let creaFig = document.createElement('figure')
        creaFig.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}"
        <figcaption>${work.title}</figcaption>`
        fragment.appendChild(creaFig)
    }
   gallery.append(fragment)
}

async function displayCats() {
    const fragment = document.createDocumentFragment()
    
    for(const cat of allCats){
        let NewCat = document.createElement('li')
        NewCat.innerHTML = `${cat.name}`
        NewCat.id = `${cat.id}` 
        NewCat.classList.add('filtre_li') 
        fragment.appendChild(NewCat)
    }
    category.append(fragment)
}
/* Faire une fonction ou filter est itéré par [i]. Mettre dans cette fonction le filtre
pour les images de la galerie*/
const filter = document.querySelectorAll('.filtre_li')
// document.addEventListener("click", (e) => {
// 	e.target.dataset
// })

// console.log(allCats.size)

// async function x(){

// }
