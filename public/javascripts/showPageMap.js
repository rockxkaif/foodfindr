mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: restaurant.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

themeButton.addEventListener('click', () => {
    const theme = localStorage.getItem('selected-theme')
    console.log(theme)
    if ( theme === 'dark')
        map.setStyle('mapbox://styles/mapbox/dark-v10')
    else
        map.setStyle('mapbox://styles/mapbox/light-v10')
})

new mapboxgl.Marker()
    .setLngLat(restaurant.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${restaurant.title}</h3><p>${restaurant.address}</p>`
            )
    )
    .addTo(map)
