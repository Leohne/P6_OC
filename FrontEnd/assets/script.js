const gallery = document.querySelector(".gallery")

const allWorks = new Set()
const allCats = new Set()
const allWorksModal = new Set()

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
    adminAccess()
    logout()
    toggleModale()
}
init()
modal()

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
        <img src="${work.imageUrl}" alt="${work.title}">
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

//Affichage conditionné (si utilisateur connecté ou non)
function adminAccess() {
    const token = localStorage.getItem('token')
    if (token) {
        interfaceAdmin()
    } else {
        const edition = document.querySelector('.mode_edition')
        edition.style.display = "none"
    }

}

// fonction de l'affichage accueil avec accès login.
async function interfaceAdmin() {

    // bande noir "appliquer changement"
    const edition = document.querySelector('.mode_edition')
    edition.innerHTML = `<i class="fa-solid fa-pen-to-square title_edition"></i>
    <p class="title_edition edit">Mode édition</p><p class="publish_edition edit">publier les changements</p>`

    //login > logout
    const logout = document.querySelector('#logout')
    logout.innerHTML = "logout"

    // icone + "modifier" sous img
    const modiFig = document.querySelector('#introduction > figure')
    const modifImg = document.createElement('div')
    modifImg.innerHTML = `<div class="modifier"><i class="fa-solid fa-pen-to-square modifier_placement modifier_cursor"></i>
    <p class="modifier_cursor">Modifier</p></div>`
    modiFig.append(modifImg)

    // icone + "modifier" à droite du h2 "projet"
    const projet = document.querySelector('#portfolio > h2')
    projet.innerHTML = `<div class="modifier projet-modif"><h2>Mes Projets</h2><div class="projet_placement"><i class="fa-solid fa-pen-to-square"></i>
    <p class="modif_modal modalToggle">Modifier</p></div></div>`

    //cache des filtres
    const filter = document.querySelector('.ContainFilter')
    filter.style.display = "none"

}
//Déconnecter le profil
function logout() {
    const token = localStorage.getItem('token')
    const logout = document.querySelector('#logout')
    logout.addEventListener('click', (e) => {
        if (token) {
            localStorage.removeItem('token')
            window.location.replace("/index.html");
        }
    })
}
//Affichage & fermeture du modale
function toggleModale() {
    const moToggle = document.querySelectorAll('.modalToggle')

    moToggle.forEach(moToggle => moToggle.addEventListener('click', toggleContainer))
}

function toggleContainer() {
    const modalContainer = document.querySelector('.modalContainer')
    modalContainer.classList.toggle('current')
}

//Création du modale
async function modal() {
    const modal = document.querySelector('.modalContainer')
    const modalDiv = document.createElement('div')
    modalDiv.innerHTML = `<div class="modalOverlay modalToggle"><div class="modalScreen">
        <button class="modalCross modalToggle">X</button>
        <div class="modalGalerie">
        <h2>Galerie photo</h2>
        <div class="gallery_modal"></div>
        <div class="modalFooter">
        <div class="modalLine"></div>
        <button class="addBtn">Ajouter une photo</button>
        <p class="suppr">Supprimer la galerie</p>
        </div></div></div></div>`
    modal.append(modalDiv)
    const works = await getDatabaseInfo("works")
    for (const modWork of works) {
       allWorksModal.add(modWork)
    }
    displayWorksModal(allWorksModal)
 }

//affichage des photos dans la modale
function displayWorksModal(works) {
    const modalGalerie = document.querySelector('.gallery_modal')
    gallery.innerHTML = ""
    const fragment = document.createDocumentFragment()

    for (const work of works) {
        let creaFig = document.createElement('figure')
        creaFig.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <i class="fa-solid fa-trash-can"></i>
        <figcaption>éditer</figcaption>`
        fragment.appendChild(creaFig)
    }
    modalGalerie.append(fragment)
}