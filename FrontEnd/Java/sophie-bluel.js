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
        } else {
            json.forEach(PhotoGallery);
        }

    } catch (error) {
        console.error(error.message);
    }
}
WorksApi();

function PhotoGallery(data) {
    const images = document.createElement("div");
    images.innerHTML = `<img src=${data.imageUrl} alt=${data.title}><figcaption>${data.title}<figcaption>`;
    document.querySelector(".gallery").append(images);
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
        projetsEdition.innerHTML = '<a href=""><p><i class="fa-regular fa-pen-to-square"></i>modifier</p></a>'
        document.querySelector(".mes-projets").append(projetsEdition);
        var element = document.querySelector(".categorie-div");
        element.remove();
        document.querySelector("#logout").innerHTML = "logout";
        document.querySelector("#logout").addEventListener("click", () => sessionStorage.removeItem("authtoken"))
    }


}
AdminMode();