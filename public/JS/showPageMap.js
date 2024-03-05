mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  // style: "mapbox://styles/mapbox/streets-v12", // style URL
  style: "mapbox://styles/mapbox/navigation-night-v1",
  center: ground.geometry.coordinates, // starting position [lng, lat]
  zoom: 8, // starting zoom
});

new mapboxgl.Marker()
  .setLngLat(ground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({
      offset: 25,
    })
      .setHTML(
        `<h5 style="padding:2px">${ground.title}</h5><p>${ground.location}</p>`
      )
      .setMaxWidth("200px")
  )
  .addTo(map);

const nav = new mapboxgl.NavigationControl({
  showCompass: false,
});
map.addControl(nav, "top-right");
