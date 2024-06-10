const title = document.title;
// Initialize the Leaflet map
const map = L.map('map', {
    crs: L.CRS.Simple,
    zoomControl: true, // Keep the zoom control
    attributionControl: false // Remove the attribution control (optional)
});

// Load the image and get its natural dimensions
const image = new Image();
if (title === 'small-width-height') {
    image.src = '../assets/img/1.png';
} else if (title === 'big-width') {
    image.src = '../assets/img/2.png';
} else if (title === 'big-height') {
    image.src = '../assets/img/3.png';
}
image.onload = function () {
    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;

    // Define the bounds of the image
    const bounds = [[0, 0], [imageHeight, imageWidth]];

    // Get the dimensions of the map container
    const mapContainer = document.getElementById('map');
    const containerWidth = mapContainer.offsetWidth;
    const containerHeight = mapContainer.offsetHeight;

    // Calculate the minimum zoom level based on the image's natural size
    var minZoom;

    if (containerWidth >= imageWidth && containerHeight >= imageHeight) {
        minZoom = 0; // Natural size
    } else {
        const containerAspectRatio = containerWidth / containerHeight;
        const imageAspectRatio = imageWidth / imageHeight;

        if (containerAspectRatio > imageAspectRatio) {
            minZoom = Math.log2(containerHeight / imageHeight);
        } else {
            minZoom = Math.log2(containerWidth / imageWidth);
        }
    }

    // Add the image overlay to the map
    L.imageOverlay(image.src, bounds).addTo(map);

    // Set the map view to fit the image bounds
    map.fitBounds(bounds);

    // Restrict the map to the image bounds
    map.setMaxBounds(bounds);

    // Set the minimum zoom level to the calculated value
    map.setMinZoom(minZoom);

    // Disable zooming beyond the image bounds
    map.on('drag', function () {
        map.panInsideBounds(bounds, { animate: false });
    });

    // Ensure the image matches the screen width or height if it's larger
    if (imageWidth > containerWidth || imageHeight > containerHeight) {
        map.setZoom(minZoom);
    } else {
        map.setZoom(0); // Natural size
    }
};