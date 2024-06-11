// Get the title of the document, which will be used to determine the image source
const title = document.title;

// Initialize the Leaflet map with specific options
const map = L.map('map', {
    crs: L.CRS.Simple, // Use a simple coordinate reference system (no projection)
    zoomControl: true, // Enable the zoom control on the map
    attributionControl: false // Disable the attribution control (optional)
});

// Create a new Image object to load the image
const image = new Image();

// Set the image source based on the document title
if (title === 'small-width-height') {
    image.src = '../assets/img/1.png'; // Load a small image
} else if (title === 'big-width') {
    image.src = '../assets/img/2.png'; // Load an image with a big width
} else if (title === 'big-height') {
    image.src = '../assets/img/3.png'; // Load an image with a big height
}

// When the image has loaded, execute the following function
image.onload = function () {
    // Get the natural dimensions of the image
    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;

    // Define the geographical bounds of the image
    const bounds = [[0, 0], [imageHeight, imageWidth]];

    // Get the dimensions of the map container
    const mapContainer = document.getElementById('map');
    const containerWidth = mapContainer.offsetWidth;
    const containerHeight = mapContainer.offsetHeight;

    // Calculate the minimum zoom level based on the image's natural size
    var minZoom;

    // Check if the container can fit the image at its natural size
    if (containerWidth >= imageWidth && containerHeight >= imageHeight) {
        minZoom = 0; // No need to zoom out, show the image at natural size
    } else {
        // Calculate aspect ratios of the container and the image
        const containerAspectRatio = containerWidth / containerHeight;
        const imageAspectRatio = imageWidth / imageHeight;

        // Determine the minimum zoom level based on aspect ratios
        if (containerAspectRatio > imageAspectRatio) {
            minZoom = Math.log2(containerHeight / imageHeight);
        } else {
            minZoom = Math.log2(containerWidth / imageWidth);
        }
    }

    // Add the image overlay to the map using the defined bounds
    L.imageOverlay(image.src, bounds).addTo(map);

    // Set the map view to fit the bounds of the image
    map.fitBounds(bounds);

    // Restrict the map to the image bounds to prevent panning outside
    map.setMaxBounds(bounds);

    // Set the minimum zoom level for the map
    map.setMinZoom(minZoom);

    // Prevent the user from dragging the map outside the bounds of the image
    map.on('drag', function () {
        map.panInsideBounds(bounds, { animate: false });
    });

    // Ensure the image is fully visible within the container
    if (imageWidth > containerWidth || imageHeight > containerHeight) {
        map.setZoom(minZoom); // Zoom out to fit the image within the container
    } else {
        map.setZoom(0); // Show the image at its natural size
    }
};
