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
    const images = document.createElement("images");
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
    categorie.innerHTML = `${data.name}`;
    document.querySelector(".categorie-div").append(categorie);
}
document.querySelector(".Tous").addEventListener("click", () => WorksApi());