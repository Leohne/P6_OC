const gallery = document.querySelector(".gallery")

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
    displayCatsContainer()
}
init()

// requete serveur
async function getDatabaseInfo(type) {
    const response = await fetch("http://localhost:5678/api/" + type)
    if (response.ok) {
        return response.json()
    } else {
        console.log(response.error);
    }
}

// creation des boutons de catégorie
function displayCatsContainer() {
    const contain = document.querySelector('.ContainFilter')
    const fragment = document.createDocumentFragment()

    let neutral = document.createElement('button')
    neutral.innerHTML = "Tous"
    neutral.classList.add('active', 'filtre')
    neutral.dataset.id = 0

    fragment.appendChild(neutral)

    for (const cat of allCats) {
        let NewCat = document.createElement('button')
        NewCat.innerHTML = `${cat.name}`
        NewCat.classList.add('filtre')
        NewCat.dataset.id = `${cat.id}`
        fragment.appendChild(NewCat)
    }
    contain.appendChild(fragment)
    addFiltterListener()
}

function addFiltterListener() {
    const buttons = document.querySelectorAll(".filtre")
    for (const button of buttons) {
        button.addEventListener("click", (e) => {
            const clickedButton = e.target
            const cat_id = parseInt(clickedButton.dataset.id)
            if (cat_id == 0) {
                displayWorks(allWorks)
            } else {
                const filtredWorks = [...allWorks].filter(work => work.categoryId == cat_id)
                displayWorks(filtredWorks)
            }
            document.querySelector(".active").classList.remove("active")
            clickedButton.classList.add("active")
        })
    }
}

// mise en page des images 
function displayWorks(works) {
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








// document.addEventListener("DOMContentLoaded", () => {
//     const container = document.querySelectorAll(".divParent")[0];
//     for (let i = 0; i < 3; i++) {
//         let child = document.createElement("div");
//         container.appendChild(child);
//         child.classList.add("divChild")
//     }
//     const children = document.querySelectorAll(".divChild");
//     alert(`There are ${children.length} children`);
// })
