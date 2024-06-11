// Array containing the sources of the images to be loaded
const imageSources = ['../assets/img/1.png', '../assets/img/2.png', '../assets/img/3.png', '../assets/img/4.png', '../assets/img/5.png'];

// Variable to keep track of the total height of all loaded images
let totalHeight = 0;

// Get the dimensions of the map container
const mapContainer = document.getElementById('map');
const containerWidth = mapContainer.offsetWidth;

// Initialize the Leaflet map with specific options
const map = L.map('map', {
    crs: L.CRS.Simple, // Use a simple coordinate reference system (no projection)
    zoomControl: true, // Enable the zoom control on the map
    attributionControl: false // Disable the attribution control (optional)
});

// Variable to store the scaled height of the current image being loaded
var scaledHeight = 0;

// Function to load an image given its index in the imageSources array
async function loadImage(index) {
    const image = new Image(); // Create a new Image object
    image.src = imageSources[index]; // Set the source of the image
    await new Promise((resolve) => { // Use a Promise to ensure the image is loaded before proceeding
        image.onload = function () {
            // Get the natural dimensions of the image
            const imageWidth = image.naturalWidth;
            const imageHeight = image.naturalHeight;

            // Calculate the scale to fit the image width within the container width
            const scale = containerWidth / imageWidth;
            scaledHeight = imageHeight * scale; // Calculate the scaled height of the image

            // Calculate the bounds for the image based on the scaled height
            const bounds = calculateBounds(scaledHeight);

            // Add the image overlay to the map using the calculated bounds
            L.imageOverlay(image.src, bounds).addTo(map);

            // Fit the map view to the bounds of the image
            map.fitBounds(bounds);

            // Set the maximum bounds of the map to prevent panning outside the total image area
            map.setMaxBounds([[0, 0], [totalHeight, containerWidth]]);

            // Prevent the user from dragging the map outside the combined bounds of all images
            map.on('drag', function () {
                map.panInsideBounds([[0, 0], [totalHeight + scaledHeight, containerWidth]], { animate: false });
            });

            // Resolve the Promise after the image is loaded and displayed
            resolve();
        };
    });
}

// Function to calculate the bounds for an image based on its scaled height
function calculateBounds(scaledHeight) {
    let top = totalHeight; // The top bound is the current total height
    let bottom = totalHeight + scaledHeight; // The bottom bound is the total height plus the scaled height of the current image

    // Update the total height to include the scaled height of the current image
    totalHeight += scaledHeight;

    // Return the calculated bounds as a 2D array
    return [[top, 0], [bottom, containerWidth]];
}

// Immediately invoked function expression (IIFE) to load and display all images
(async function () {
    for (let i = imageSources.length - 1; i >= 0; i--) { // Loop through the image sources in reverse order
        await loadImage(i); // Use await to ensure each image is loaded in sequence
    }
    // Set the view to focus on the top picture after all images are loaded
    map.setView([scaledHeight + totalHeight, containerWidth / 2], 0); // Center the map on the top of the image stack
})();
