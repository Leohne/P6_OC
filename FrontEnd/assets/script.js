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