const gallery = document.querySelector(".gallery")
const token = localStorage.getItem("token")

const allWorks = new Set()
const allCats = new Set()
let img = ""

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
    if (token) {
        interfaceAdmin()
        logout()
        createModalGallery()
        createModalAdd()
        modalSuppr()
    }
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

// mise en page des images 
function displayWorks(works) {
    gallery.innerHTML = ""
    const fragment = document.createDocumentFragment()

    for (const work of works) {
        let creaFig = document.createElement('figure')
        creaFig.id = "figure-" + work.id
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



// fonction de l'affichage accueil avec accès login.
async function interfaceAdmin() {

    // bande noir "appliquer changement"
    const edition = document.querySelector('.mode_edition')
    edition.style.display = "flex"
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
    const logout = document.querySelector('#logout')
    logout.addEventListener('click', (e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        window.location.reload()
    })
}

function openCloseModal(name) {
    var modal = document.getElementById("modalGallery");


    // Ouvrir la modale
    var btn = document.querySelector(".projet_placement");

    // fermer la modale avec la croix
    var close_btn = document.querySelector("#closeModal" + name);


    // evenement pour ouvrir la modale
    btn.addEventListener("click", (e) => {
        modal.style.display = "flex";
    })

    // evenement pour fermer la modale sur la croix
    close_btn.addEventListener("click", (e) => {
        modal.style.display = "none";
    })

    //evenement pour fermer la modale en cliquand en dehors de la modale
    window.addEventListener("click", (e) => {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    })
}

//Création du modale
function createModalGallery() {
    const modal = document.querySelector('#modalGallery')
    const modalDiv = document.createElement('div')
    modalDiv.classList.add("modalScreen")
    modalDiv.innerHTML = `
        <div class="cross"><p class="modalCross modalToggle" id="closeModalGallery">X</p></div>
        <h2>Galerie photo</h2>
        <div class="gallery_modal"></div>
        <div class="modalFooter">
        <div class="modalLine"></div>
        <button class="addBtn addBtnUn">Ajouter une photo</button>
        <p class="suppr">Supprimer la galerie</p>
        </div>`
    modal.append(modalDiv)
    displayWorksModal()
    openCloseModal("Gallery")

}

// function inModalScreen {

// }
//affichage des photos dans la modale
function displayWorksModal() {
    const modalGalerie = document.querySelector('.gallery_modal')
    modalGalerie.innerHTML = ""
    const fragment = document.createDocumentFragment()

    for (const work of allWorks) {
        let creaFig = document.createElement('figure')
        creaFig.dataset.modal = work.id
        creaFig.innerHTML = `
        <i class="fa-solid fa-trash-can"></i>
        <img src="${work.imageUrl}" alt="${work.title}">        
        <figcaption>éditer</figcaption>`
        fragment.appendChild(creaFig)
    }
    modalGalerie.append(fragment)
}

function createModalAdd() {
    const btnAdd = document.querySelector('.addBtnUn')
    btnAdd.addEventListener('click', (e) => {
        const modalScreen = document.querySelector('.modalScreen')

        modalScreen.innerHTML = `
        <div class="arrow"><i class="fa-solid fa-arrow-left"></i>
        <p class="modalCross modalToggle" id="closeModalAdd">X</p></div>
        <h2>Ajout photo</h2>
        <div class="picture">
        <div class="pictureContain">
        <i class="fa-solid fa-image"></i>
        <form method="post" id="formModal">
        <input class="btnUpload" type="file" name="img" id="img">
        <p>jpg, png : 4mo max</p></div></div>
        <div class="labelStyle"><label for="text" class="labelAdd">Titre</label>
        <input type="text" class="inputAdd" id="text" required>
        <label for="category" class="labelAdd">Catégorie</label>
        <select class="labelCat inputAdd" id="category" name="category">
        </select></div>
        <div class="modalFooter">
        <div class="modalLine"></div>
        <input class="addBtn subBtn" type="submit" value="Valider"></div></form>`
        for (const idCat of allCats) {
            const labelCat = document.querySelector('.labelCat')
            let creatOption = document.createElement('option')
            creatOption.innerHTML = `<option>${idCat.name}</option>`
            labelCat.append(creatOption)
            openCloseModal("Add")            
            modalPicture()
        }
        //création AddEventListener pour la flèche retour.
        const arrow = document.querySelector('.fa-arrow-left')
        arrow.addEventListener('click', (e) => {
            modalScreen.innerHTML = `<div class="cross"><p class="modalCross modalToggle" id="closeModalGallery">X</p></div>
            <h2>Galerie photo</h2>
            <div class="gallery_modal"></div>
            <div class="modalFooter">
            <div class="modalLine"></div>
            <button class="addBtn addBtnUn">Ajouter une photo</button>
            <p class="suppr">Supprimer la galerie</p>
            </div>`
            displayWorksModal()
            openCloseModal("Gallery")
            createModalAdd()
            modalSuppr()
        })

        const imgInput = document.querySelector("#img")
        imgInput.addEventListener("change", readURL)
    })
}

// Suppression d'une photo
function modalSuppr() {
    const trashs = document.querySelectorAll('.fa-trash-can')

    for (const trash of trashs) {
        trash.addEventListener('click', (e) => {
            const targ = e.target.closest('figure')
            const id = targ.dataset.modal
            const imgGallery = document.querySelector("#figure-" + id)
            const deleteTry = deleteDatabaseWork(id)
            imgGallery.remove()
            targ.remove()
        })
    }
}

function deleteDatabaseWork(id) {
    let response = fetch('http://localhost:5678/api/works/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

}

//ajout d'une photo
function modalPicture() {
    const sendEvent = document.querySelector('.subBtn')

    sendEvent.addEventListener('click', async (e) => {
        e.preventDefault()
        const txt = document.querySelector('#text').value
        const cat = document.querySelector('#category').value

        const data = new FormData()
        data.append('image', img);
        data.append('title', txt);
        data.append('category', cat);

        const sendTest = await sendPicture(data)
        if (sendTest.error) {
            console.log("Non")
        } else {
            console.log("Ok")
        }
    })
}

async function sendPicture(data) {
    let response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: data
    });
    if (response.ok) {
        return response.json()
    } else {
        console.log(response);
        return response.json()
    }
}

// faire apparaitre l'image
function readURL(event) {
    const btn = event.target
    const pic = document.querySelector(".pictureContain")
    const temp_img = btn.files[0]
    img = temp_img
    if (btn.files && img) {
        const reader = new FileReader();

    
        reader.onload = function (e) {
            console.log(pic);
            pic.innerHTML = `<img class="imgPreview" src="${e.target.result}"/>`
        };

        reader.readAsDataURL(img);
    }
}
