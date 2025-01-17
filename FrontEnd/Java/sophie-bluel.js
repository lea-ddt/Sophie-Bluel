async function WorksApi(filter) {
    document.querySelector(".gallery").innerHTML = "";
    const url = "http://localhost:5678/api/works";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        if (filter) {
            const projets = json.filter((data) => data.categoryId === filter);
            projets.forEach(PhotoGallery);
            projets.forEach(PhotoGalleryModal);
        } else {
            json.forEach(PhotoGallery);
            json.forEach(PhotoGalleryModal);
        }
        const poubelle = document.querySelectorAll(".fa-trash-can")
        poubelle.forEach((e) => e.addEventListener("click", (event) => SuppPhoto(event)));

    } catch (error) {
        console.error(error.message);
    }
}
WorksApi();

function PhotoGallery(data) {
    const images = document.createElement("figure");
    images.setAttribute("data-id", data.id);
    images.innerHTML = `<img src=${data.imageUrl} alt=${data.title}><figcaption>${data.title}<figcaption>`;

    document.querySelector(".gallery").append(images);
}

function PhotoGalleryModal(data) {
    const images = document.createElement("figure");
    images.innerHTML = `<div class="icone-trash">
                        <img src=${data.imageUrl} alt=${data.title}>
                        <i id="${data.id}" class="fa-solid fa-trash-can overlay-icon"></i></div>`;

    document.querySelector(".gallery-modal").append(images);
}

async function CategoriesApi() {
    const url = "http://localhost:5678/api/categories";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);

        json.forEach(CategoriesFilter);

    } catch (error) {
        console.error(error.message);
    }
}
CategoriesApi();

function CategoriesFilter(data) {
    console.log(data);
    const categorie = document.createElement("div");
    categorie.className = data.id;
    categorie.addEventListener("click", () => WorksApi(data.id));
    categorie.addEventListener("click", (event) => filterhover(event));
    document.querySelector(".Tous").addEventListener("click", (event) => filterhover(event));
    categorie.innerHTML = `${data.name}`;
    document.querySelector(".categorie-div").append(categorie);
}

function filterhover(event){
    const container = document.querySelector(".categorie-div");
    Array.from(container.children).forEach((child) => child.classList.remove("active-filter"));
    event.target.classList.add("active-filter");
}
document.querySelector(".Tous").addEventListener("click", () => WorksApi());

function AdminMode() {
    if (sessionStorage.authtoken){
        const banner = document.createElement("div");
        banner.className = "edition"
        banner.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>';
        document.body.prepend(banner);
        
        const projetsEdition = document.createElement("div");
        projetsEdition.className = "projets-edition"
        projetsEdition.innerHTML = '<button><i class="fa-regular fa-pen-to-square"></i>modifier</button>'
        document.querySelector(".mes-projets").append(projetsEdition);

        var element = document.querySelector(".categorie-div");
        element.remove();
        document.getElementById("logout").innerHTML = "logout";
        document.getElementById("logout").href = "index.html";
        document.getElementById("logout").addEventListener("click", () => sessionStorage.removeItem("authtoken"))
    }
}
AdminMode();

const projetsEdition = document.querySelector(".projets-edition")
if (projetsEdition){
    projetsEdition.addEventListener("click", toggleModal);
}

const modalClosing = document.querySelectorAll(".modal-trigger");
modalClosing.forEach(trigger => trigger.addEventListener("click", toggleModal))

function toggleModal() {
    document.querySelector(".modal-container").classList.toggle("active");
}

async function SuppPhoto(event) {
    const id = event.target.id;
    const SuppApi = `http://localhost:5678/api/works/${id}`;
    const token = sessionStorage.authtoken;

    try {
        let response = await fetch(SuppApi, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token,
            },
        });

        if (response.ok) {
            const modalFigure = event.target.closest('figure');
            if (modalFigure) {
                modalFigure.remove();
            }
                const galleryFigure = document.querySelector(`.gallery figure[data-id="${id}"]`);
            if (galleryFigure) {
                galleryFigure.remove();
            
            }
        } else {
            const errorMessage = await response.json();
            console.error(errorMessage);
            const errorDiv = document.createElement("div");
            errorDiv.className = "error";
            errorDiv.innerHTML = "Une erreur s'est produite, veuillez réessayer plus tard.";
            document.querySelector(".gallery").append(errorDiv);
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de la photo:", error);
        const errorDiv = document.createElement("div");
        errorDiv.className = "error";
        errorDiv.innerHTML = "Une erreur s'est produite";
        document.querySelector(".gallery").append(errorDiv);
    }
}


const ajouterPhoto = document.querySelector(".ajouter-une-photo")
const boutonRetour = document.querySelector(".retour")

ajouterPhoto.addEventListener("click", switchModal);
boutonRetour.addEventListener("click", switchModal);

function switchModal() {
    const modalGallery = document.querySelector(".modal-gallery");
    const modalAddPhoto = document.querySelector(".modal-add-photo");

    if (modalGallery.style.display === "block" || modalGallery.style.display === "") 
    {
        modalGallery.style.display = "none";
        modalAddPhoto.style.display = "block";
    } else {
        modalGallery.style.display = "block";
        modalAddPhoto.style.display = "none";
    }
}