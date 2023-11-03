document.getElementById("addressForm").addEventListener("input", function () {
    // On récupérer l'élément HTML <input id="address">
    const addressInput = document.getElementById("address");

    // Récupérer la valeur saisie par l'utilisateur
    const address = addressInput.value;

    // Effectuer un appel à l'API Adresse uniquement si l'adresse saisie n'est pas vide
    if (address.trim() !== "") {
        const apiUrl = "https://api-adresse.data.gouv.fr/search/?q=" + encodeURI(address); // encodeURI() permet d'échapper les caractères spéciaux

        const request = new XMLHttpRequest(); // Création de l'objet XMLHttpRequest
        request.open("GET", apiUrl, true); // Appel de l'API en mode asynchrone

        // Gestion de l'événement indiquant la fin de la requête
        request.onreadystatechange = function () {
            // Si la requête est terminée
            if (request.readyState === 4 && request.status === 200) {
                const response = JSON.parse(request.responseText); // Conversion du JSON en objet JavaScript

                //Si la réponse contient des résultats
                if (response.features && response.features.length > 0) {
                    // compte le nombre de résultats
                    const nbResults = response.features.length;

                    // Création d'une liste HTML
                    const ul = document.createElement("ul");
                    ul.setAttribute("id", "results"); // Ajout de l'attribut id="results"

                    // Boucle sur les résultats
                    for (let i = 0; i < nbResults; i++) {
                        const result = response.features[i];
                        const label = result.properties.label;
                        const li = document.createElement("li"); // Création d'un élément <li>
                        li.textContent = label;
                        ul.appendChild(li); // Ajout du <li> à la liste <ul>
                    }

                    // Résultat bloqué à 5 éléments à cause de la pagination de l'API

                    // Ajout de la liste au DOM
                    document.getElementById("result").textContent = ""; // Effacez le résultat précédent
                    document.getElementById("result").appendChild(ul); // Ajout de la liste au DOM

                    // Récupérez les coordonnées (latitude et longitude) de l'adresse
                    if (nbResults === 1) {
                        result = response.features[0];
                        const coordinates = result.geometry.coordinates;
                        const latitude = coordinates[1];
                        const longitude = coordinates[0];

                        // Affichez la carte à ces coordonnées
                        // initMap(latitude, longitude);

                        // Créer du texte devant le lien
                        const text = document.createElement("span");
                        text.textContent = "Adresse trouvé : ";
                        document.getElementById("result").appendChild(text); // Ajout du texte au DOM

                        // Construisez le lien vers Google Maps
                        const googleMapsLink = document.createElement("a");
                        googleMapsLink.textContent = "Ouvrir dans Google Maps";
                        googleMapsLink.href = `https://www.google.com/maps?q=${latitude},${longitude}`;
                        googleMapsLink.target = "_blank";
                        document.getElementById("result").appendChild(googleMapsLink);
                    }

                } else {
                    document.getElementById("result").textContent = "Aucune adresse trouvée.";
                }
            }
        };
        request.send();
    } else {
        // Effacez le résultat si le champ est vide
        document.getElementById("result").textContent = "";
    }
});

// Fonction pour initialiser la carte Google Maps
// function initMap(latitude, longitude) {
//     const map = new google.maps.Map(document.getElementById("map"), {
//         center: { lat: latitude, lng: longitude },
//         zoom: 15
//     });
//     new google.maps.Marker({
//         position: { lat: latitude, lng: longitude },
//         map: map,
//         title: "Adresse recherché"
//     });
// }