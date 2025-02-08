let AllWorks = []; // Tableau pour stocker toutes les œuvres récupérées depuis l'API

// Fonction pour récupérer les œuvres depuis l'API
async function WorksApi() {
    const url = "http://localhost:5678/api/works";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        AllWorks = await response.json(); // Stockage des données reçues
        baseWorks(); // Affichage initial de la galerie
    } catch (error) {
        console.error(error.message);
    }
}
WorksApi();

// Fonction principale pour afficher la galerie et la modale avec un filtre optionnel
function baseWorks(filter) {
    document.querySelector(".gallery").innerHTML = "";
    document.querySelector(".gallery-modal").innerHTML = "";

    let projets = filter ? AllWorks.filter((item) => item.categoryId === filter) : AllWorks;
    
    projets.forEach(PhotoGallery); // Affichage des œuvres dans la galerie
    projets.forEach(PhotoGalleryModal); // Affichage dans la modale

    SuppTrashCan(); // Activation des icônes de suppression
}



// -------------
//    GALLERY
// -------------

// Fonction d'affichage des images dans la galerie
function PhotoGallery(data) {
    const images = document.createElement("figure");
    images.setAttribute("data-id", data.id);
    images.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
                        <figcaption>${data.title}<figcaption>`;
    document.querySelector(".gallery").append(images);
}


// Fonction d'affichage des images dans la galerie modale
function PhotoGalleryModal(data) {
    const images = document.createElement("figure");
    images.innerHTML = `<div class="icone-trash">
                        <img src=${data.imageUrl} alt=${data.title}>
                        <i id="${data.id}" class="fa-solid fa-trash-can overlay-icon"></i></div>`;
    document.querySelector(".gallery-modal").append(images);
}



// ----------------
//    CATEGORIES
// ----------------

// Fonction pour récuperer les catégories depuis l'API
async function CategoriesApi() {
    const url = "http://localhost:5678/api/categories";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const categorySelect = document.getElementById("category")

        // Création de l'option vide par défaut
        let option = document.createElement("option");
            option.value = "";
            option.textContent = "";
            option.selected = false
        categorySelect.appendChild(option);

        // Ajout des catégories dynamiquement
        json.forEach((data) => {
            CategoriesFilter(data);
            option = document.createElement("option");
            option.value = data.id;
            option.textContent = data.name;
            option.selected = false
            categorySelect.appendChild(option);
        });

    } catch (error) {
        console.error(error.message);
    }
}
CategoriesApi();



// Fonction pour ajouter dynamiquement les catégories dans le filtre
function CategoriesFilter(data) {
    const categorie = document.createElement("div");
          categorie.className = data.id;
          categorie.addEventListener("click", () => baseWorks(data.id)); // Filtrage des œuvres
          categorie.addEventListener("click", (event) => filterhover(event)); // Effet visuel
    document.querySelector(".Tous").addEventListener("click", (event) => filterhover(event));
          categorie.innerHTML = `${data.name}`;
    document.querySelector(".categorie-div").append(categorie);
}



// Fonction pour gérer l'effet de survol actif sur les filtres
function filterhover(event) {
    const container = document.querySelector(".categorie-div");
    Array.from(container.children).forEach((child) => child.classList.remove("active-filter"));
    event.target.classList.add("active-filter");
}

document.querySelector(".Tous").addEventListener("click", () => baseWorks()); // Affichage de toutes les œuvres


// ----------------
//    MODE ADMIN
// ----------------


// Fonction d'affichage après le login
function AdminMode() {
    if (sessionStorage.authtoken){
        //bannière d'édition noir
        const banner = document.createElement("div");
        banner.className = "edition"
        banner.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>';
        document.body.prepend(banner);
        
        // Bonton modifier modale
        const projetsEdition = document.createElement("div");
        projetsEdition.className = "projets-edition"
        projetsEdition.innerHTML = '<button><i class="fa-regular fa-pen-to-square"></i>modifier</button>'
        document.querySelector(".mes-projets").append(projetsEdition);

        // Retirer les catégories
        const categoryDiv = document.querySelector(".categorie-div")
        categoryDiv.style.display = "none"

        // bouton logout
        document.getElementById("logout").innerHTML = "logout";
        document.getElementById("logout").href = "index.html";
        document.getElementById("logout").addEventListener("click", () => sessionStorage.removeItem("authtoken"))
    }
}
AdminMode();



// --------------
//    MODALE 1
// --------------

// affichage de la modale en appuyant sur modifier
const projetsEdition = document.querySelector(".projets-edition")
if (projetsEdition){
    projetsEdition.addEventListener("click", toggleModal);
}
// fermeture de la modale a chaque "modal-trigger"
const modalClosing = document.querySelectorAll(".modal-trigger");
modalClosing.forEach(trigger => trigger.addEventListener("click", toggleModal))

function toggleModal() {
    document.querySelector(".modal-container").classList.toggle("active");
}



// ----------------
//    SUPP PHOTO
// ----------------

// Fonction de suppression des photos
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
            // supprimer la photo de la modale
            const modalFigure = event.target.closest("figure");
            if (modalFigure) {
                modalFigure.remove();
            }
            // supprimer la photo de la gallerie avec le même id
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



// Activation des boutons de suppression
function SuppTrashCan() {
    const poubelle = document.querySelectorAll(".fa-trash-can");
    poubelle.forEach((e) => e.addEventListener("click", (event) => SuppPhoto(event)));
}



// ------------------------
//    MODALE AJOUT PHOTO
// ------------------------

// Sélection des boutons pour ouvrir et fermer la modale d'ajout de photo
const ajouterPhoto = document.querySelector(".ajouter-une-photo");
const boutonRetour = document.querySelector(".retour");

// Ajout d'un événement pour ouvrir ou fermer la modale lorsque les boutons sont cliqués
ajouterPhoto.addEventListener("click", switchModal);
boutonRetour.addEventListener("click", switchModal);

// Fonction qui permet de basculer entre la galerie et la modale d'ajout de photo
function switchModal() {
    const modalGallery = document.querySelector(".modal-gallery");
    const modalAddPhoto = document.querySelector(".modal-add-photo");

    // Vérifie l'état actuel et bascule entre les deux vues
    if (modalGallery.style.display === "block" || modalGallery.style.display === "") 
    {
        modalGallery.style.display = "none";
        modalAddPhoto.style.display = "block";
    } else {
        modalGallery.style.display = "block";
        modalAddPhoto.style.display = "none";
    }
}

// --------------
//   FORMULAIRE
// --------------

let img = document.createElement("img"); // Création d'un élément image pour l'aperçu
let file; // Variable pour stocker le fichier image sélectionné

const fileInput = document.getElementById('file'); // Sélection du champ d'upload
const previewContainer = document.getElementById('preview-container'); // Conteneur d'aperçu de l'image

// Ajout d'un événement pour gérer l'affichage de l'image sélectionnée
fileInput.addEventListener('change', function(event) {
    file = event.target.files[0]; // Récupère le fichier sélectionné
    previewContainer.innerHTML = ""; // Réinitialise l'aperçu

    // Vérifie si le fichier est une image PNG ou JPEG
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
        const imgUrl = URL.createObjectURL(file); // Génère une URL temporaire pour l'aperçu

        const imgElement = document.createElement('img');
        imgElement.src = imgUrl;
        imgElement.alt = "Aperçu de l'image";
        imgElement.style.maxWidth = "200px";
        imgElement.style.maxHeight = "200px";

        previewContainer.appendChild(imgElement); // Ajoute l'image à l'aperçu
        document.querySelector(".file-display").style.display = "none"; // Cache le bouton d'upload

    } else {
        alert("Veuillez sélectionner un fichier JPG ou PNG valide.");
    }
});

// Sélection et écoute des champs du formulaire
const titlePicture = document.getElementById("title");
let titleValue = "";
const categorySelect = document.getElementById("category");

// Écoute le changement de la catégorie sélectionnée
categorySelect.addEventListener("change", (event) => {
    selectedValue = event.target.value;
});

// Écoute la saisie du titre de l'image
titlePicture.addEventListener("input", function () {
    titleValue = titlePicture.value;
});

// Sélection du formulaire et ajout d'un écouteur pour la soumission
const imageForm = document.querySelector(".modal-form");
imageForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    // Vérifie si une image et un titre sont bien renseignés
    const validerImage = document.getElementById('preview-container').firstChild;
    if (!validerImage || !titleValue) {
        console.error("L'image ou le titre n'est pas valide.");
        return;
    }

    // Création d'un objet FormData pour envoyer l'image et les données du formulaire
    const formData = new FormData();
    if (file) {
        formData.append("image", file);
        console.log("Fichier ajouté au formulaire : ", file.name);
        document.querySelector(".validate-photo").style.background = '#1D6154';
    } else {
        console.error("Aucun fichier sélectionné.");
    }

    // Ajout du titre et de la catégorie au FormData
    formData.append("title", titleValue);
    formData.append("category", selectedValue);

    // Récupération du token de l'utilisateur
    const token = sessionStorage.authtoken;
    if (!token) {
        console.error("Token manquant.");
        return;
    }

    // Requête API pour ajouter une photo
    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                "accept": "application/json",
            },
            body: formData,
        });

        if (!response.ok) {
            console.error("Erreur lors de la requête");
            return;
        }

        const result = await response.json();
        console.log("Réponse réussie :", result);

        // Ajout de l'image à la galerie et la modale sans recharger la page
        addImageToDOM(result);

        // Réinitialisation du formulaire après l'ajout réussi
        imageForm.reset();
        previewContainer.innerHTML = "";
        document.querySelector(".file-display").style.display = "block";

        // Mise à jour du bouton valider
        validateForm();

        // Retour à la galerie et fermeture de la modale
        switchModal();
        toggleModal();

    } catch (error) {
        console.error("Erreur lors de la requête POST : ", error);
    }
});

// Fonction pour ajouter l'image à la galerie et à la modale sans rechargement
function addImageToDOM(data) {
    PhotoGallery(data);
    PhotoGalleryModal(data);
    SuppTrashCan();
}

// Sélection du bouton de validation du formulaire
const submitButton = document.querySelector(".validate-photo");

// Fonction pour activer ou désactiver le bouton valider
function validateForm() {
    const titleValue = titlePicture.value.trim();
    const selectedValue = categorySelect.value.trim();
    const hasImage = file && (file.type === "image/png" || file.type === "image/jpeg");

    if (titleValue && selectedValue && hasImage) {
        submitButton.style.backgroundColor = "#1D6154"; // Active le bouton en vert
        submitButton.disabled = false;
    } else {
        submitButton.style.backgroundColor = "#ccc"; // Désactive le bouton en gris
        submitButton.disabled = true;
    }
}

// Écoute des changements sur les champs du formulaire pour activer/désactiver le bouton
titlePicture.addEventListener("input", validateForm);
categorySelect.addEventListener("change", validateForm);
fileInput.addEventListener("change", function (event) {
    file = event.target.files[0];
    validateForm();
});