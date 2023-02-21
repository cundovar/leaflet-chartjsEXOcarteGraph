

// var map = L.map('map').setView([46.7111, 1.7191], 6);
var map = L.map("map", {
  maxBounds: L.latLngBounds(
    L.latLng(41.28, -5.7), // Sud-Ouest de la France
    L.latLng(51.06, 10.5) // Nord-Est de la France
  ),
  maxBoundsViscosity: 0.9, // Empêche le glissement des limites maximales
}).setView([46.7111, 1.7191], 6);

L.esri.basemapLayer("Gray").addTo(map);

fetch("insect_data.json")
  .then((response) => response.json())
  .then((data) => {
    // Créer une couche de cercles pour chaque maille
    var insectLayer = L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        // var radius = feature.properties.insectCount * 2; // taille du cercle en fonction du nombre d'insectes
        var color = getColor(feature.properties.insectCount); // couleur du cercle en fonction du nombre d'insectes
        return L.circleMarker(latlng, {
          //   radius: radius,
          fillColor: color,
          fillOpacity: 0.7,
          color: "#000",
          weight: 1,
        });
      },
    });

    // Ajouter la couche de cercles à la carte
    insectLayer.addTo(map);

    // Ajouter un contrôle de couches à la carte
    var overlayMaps = {
      "Insectes par maille": insectLayer,
    };
    L.control.layers(null, overlayMaps).addTo(map);

    

  });

function getColor(d) {
  return d > 100
    ? "#800026"
    :  d > 20
    ? "#E31A1C"
    : d > 5
    ? "#FC4E2A"
    : d > 1
    ? "#FD8D3C"
    
    : "";
}



// ****** chart.js********


// récupère context du canvas
fetch("insect_data.json")
  .then((response) => response.json())
  .then((data) => {
    // Filtrer les features selon les insectCount
    let featuresBelow5 = data.features.filter((feature) => feature.properties.insectCount < 5);
    let featuresBelow20 = data.features.filter((feature) => feature.properties.insectCount >= 5 && feature.properties.insectCount < 20);
    let featuresBelow50 = data.features.filter((feature) => feature.properties.insectCount >= 20 && feature.properties.insectCount < 50);
    let featuresAbove100 = data.features.filter((feature) => feature.properties.insectCount >= 100);

    // Création des labels, valeurs et couleurs pour le graphique
    let labels = ["nombre insectes < 5", "nombre insectes < 20", "nombre insectes < 50", "nombre insectes > 100"];
    let values = [featuresBelow5.length, featuresBelow20.length, featuresBelow50.length, featuresAbove100.length];
    let colors = ["#FD8D3C", "#FC4E2A", "#E31A1C", "#800026"];

    // Création du graphique avec Chart.js
    let ctx = document.querySelector("#monGraph");
    let graph = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Nombre d'insectes",
            data: values,
            backgroundColor: colors,
          },
        ],
      },
      options: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            boxWidth: 10,
            radius: 10,
            textAlign: "right",
        }
        },
      },
    });
  });