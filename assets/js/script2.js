const imageSources = ['../assets/img/1.png', '../assets/img/2.png', '../assets/img/3.png', '../assets/img/4.png', '../assets/img/5.png'];
let totalHeight = 0;
const mapContainer = document.getElementById('map');
const containerWidth = mapContainer.offsetWidth;

const map = L.map('map', {
    crs: L.CRS.Simple,
    zoomControl: true,
    attributionControl: false
});

var scaledHeight = 0;

async function loadImage(index) {
    const image = new Image();
    image.src = imageSources[index];
    await new Promise((resolve) => { // Use Promise to ensure the image is loaded before proceeding
        image.onload = function () {
            const imageWidth = image.naturalWidth;
            const imageHeight = image.naturalHeight;

            const scale = containerWidth / imageWidth;
            scaledHeight = imageHeight * scale;

            const bounds = calculateBounds(scaledHeight);

            L.imageOverlay(image.src, bounds).addTo(map);

            map.fitBounds(bounds);
            map.setMaxBounds([[0, 0], [totalHeight, containerWidth]]);
            map.setMinZoom(map.getZoom());

            map.on('drag', function () {
                map.panInsideBounds([[0, 0], [totalHeight + scaledHeight, containerWidth]], { animate: false });
            });

            resolve(); // Resolve the Promise after the image is loaded and displayed
        };
    });
}

function calculateBounds(scaledHeight) {
    let top = totalHeight;
    let bottom = totalHeight + scaledHeight;

    totalHeight += scaledHeight; // Update the total height for the next image

    return [[top, 0], [bottom, containerWidth]];
}

// Load and display all images
(async function () {
    for (let i = imageSources.length - 1; i >= 0; i--) {
        await loadImage(i); // Use await to ensure images are loaded in sequence
    }
    // Focus on the top picture
    map.setView([scaledHeight + totalHeight, containerWidth / 2], 0); // Set the view to the top of the map
})();
