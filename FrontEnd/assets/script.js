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
//init()

// requete serveur
async function getDatabaseInfo(type) {
    const response = await fetch("http://localhost:5678/api/" + type)
    if (response.ok) {
        return response.json()
    } else {
        console.log(response.error);
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

function adminAccess() {
    const token = localStorage.getItem('token')
    if (token != null) {
        interfaceAdmin()
    } else {
        const edition = document.querySelector('.mode_edition')
        edition.style.display ="none"
        init()
    }

}
adminAccess()

async function interfaceAdmin() {
    const edition = document.querySelector('.mode_edition')
    edition.innerHTML = `<i class="fa-solid fa-pen-to-square title_edition"></i>
    <p class="title_edition edit">Mode édition</p><p class="publish_edition edit">publier les changements</p>`

    const logout = document.querySelector('#logout')
    logout.innerHTML = "logout"

    const modiFig = document.querySelector('#introduction > figure')
    const modifImg = document.createElement('div')
    modifImg.innerHTML = `<div class="modifier"><i class="fa-solid fa-pen-to-square modifier_placement modifier_cursor"></i>
    <p class="modifier_cursor">Modifier</p></div>`
    modiFig.append(modifImg)
    
    const projet = document.querySelector('#portfolio > h2')
    projet.innerHTML = `<div class="modifier projet-modif"><h2>Mes Projets</h2><div class="projet_placement"><i class="fa-solid fa-pen-to-square"></i>
    <p>Modifier</p></div></div>`
    const filter = document.querySelector('.ContainFilter')
    filter.style.display = "none"
    init()
}

