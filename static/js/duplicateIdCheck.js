mapboxgl.accessToken = 'pk.eyJ1IjoianVuZ2hvbmciLCJhIjoiY2twbnBiZTA3MXQ3NjJ2bHJodHJmN2oyYSJ9.QW798Vk3hHy6I158OoHDzg';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/junghong/ckqrasy9j3rm618uoethm0itp', // style URL
    center: [127.047956, 37.504059],// starting position [lng, lat]
    zoom: 15, // starting zoom
    pitch: 0,
    antialias: true, // create the gl context with MSAA antialiasing, so custom layers are antialiased
});

let geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    flyTo: {
        bearing: 0,
        // Control the flight curve, making it move slowly and
        // zoom out almost completely before starting to pan.
        speed: 0.5, // Make the flying slow.
        curve: 1, // Change the speed at which it zooms out.
        // This can be any easing function: it takes a number between
        // 0 and 1 and returns another number between 0 and 1.
        easing: function (t) {
            return t;
        }
    },
    mapboxgl: mapboxgl
})

// Add the geocoder to the map
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

map.on('load', () => {
    // Insert the layer beneath any symbol layer
    const layers = map.getStyle().layers;
    let labelLayerId;
    for(let i = 0 ; i < layers.length ; i++) {
        if(layers[i].type === "symbol" && layers[i].layout["text-field"]) {
            labelLayerId = layers[i].id;
            break;
        }
    }
    map.addLayer({
        id: "3D-extrusions-click",
        source: "composite",
        "source-layer": 'merged-0mpwhz',
        // filter: ["==", "extrude", "true"],  // 변경할 부분 예상(geojson에 맞게)
        type: "fill-extrusion",
        minzoom: 0,
        layout: {
            visibility: 'visible',
        },
        paint: {
            // color based on feature state
            "fill-extrusion-color": [
                "case",
                ["==", ["feature-state", "highlight"], "true"],
                "#FFF",
                ["==", ["get", "NMLY"], ["feature-state", "heightFilterValue"]],
                "#333",
                "#AAA",
            ],
            "fill-extrusion-height": ["*", ["get", "NMLY"], 2],
            "fill-extrusion-opacity": 0.9,
        },
        promoteId: true
    }, labelLayerId );
    
    const findParent = (features) => {
        const clicked = features[0];
        if(clicked.properties.UFID) {
            const all_features = map.queryRenderedFeatures({
                layers: ["3D-extrusions-click"],
                filter: ["boolean", "highlight", true]
            });
            let parent;
            
            all_features.every(feature => {
                if(feature.properties.UFID === clicked.properties.UFID) {
                    parent = feature;
                    return false;
                } else {
                    return true;
                }
            });
            return parent ? parent : clicked;
        } else {
            return clicked;
        }
    }
    const selectFeatures = (() => {
        let previous;
        return ids => {
            if (ids !== previous && previous !== undefined) {
                previous.forEach(p_id => {
                    map.setFeatureState(
                        {
                            source: "composite",
                            sourceLayer: "merged-0mpwhz",
                            id: p_id
                        },
                        { highlight: "false" }
                    );
                });
            }
            previous = ids;
            ids.forEach(id => {
                map.setFeatureState(
                    { source: "composite", sourceLayer: "merged-0mpwhz", id },
                    { highlight: "true", test: "12314313"}
                );
            });
        };
    })();
    map.on("click", e => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ["3D-extrusions"]
        });
        if (features) {
            // find the findParent
            const parent = findParent(features);
            let ids = [parent.id];
            if(parent.properties.parts) {
                ids = ids.concat(JSON.parse(parent.properties.parts));
            }
            selectFeatures(ids);
        }
    })
})

map.on('click', function (e) {
  var features = map.queryRenderedFeatures(e.point);
  // Limit the number of properties we're displaying for
  // legibility and performance
  var displayProperties = [
    'type',
    'properties',
    'id',
    'layer',
    'source',
    'sourceLayer',
    'state'
  ];
    
  let displayFeatures = features.map(function (feat) {
    let displayFeat = {};
    displayProperties.forEach(function (prop) {
        displayFeat[prop] = feat[prop];
    });
    return displayFeat;
  });
  document.getElementById('features').innerHTML = JSON.stringify(
    displayFeatures,
    null,
    2
  );
});


map.on('click', e => {
    let features = map.queryRenderedFeatures(e.point);
    let markerHeight = 50, markerRadius = 10, linearOffset = 25;
    let popupOffsets = {
        'top': [0, 0],
        'top-left': [0,0],
        'top-right': [0,0],
        'bottom': [0, -markerHeight],
        'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'left': [markerRadius, (markerHeight - markerRadius) * -1],
        'right': [-markerRadius, (markerHeight - markerRadius) * -1]
    };
    let ANNO = features[0].properties.ANNO;
    let NAME = features[0].properties.NAME;
    let BUNU = features[0].properties.BUNU;
    let KIND = features[0].properties.KIND;
    let NMLY = features[0].properties.NMLY;
    let RDNM = features[0].properties.RDNM;
    let SERV = features[0].properties.SERV;
    let SHAPE_Area = features[0].properties.SHAPE_Area;
    let SHAPE_Leng = features[0].properties.SHAPE_Leng;
    let UFID = features[0].properties.UFID;
    let geom_Area = features[0].properties.geom_Area;
    let geom_Lengt = features[0].properties.geom_Lengt;
    let layer = features[0].properties.layer;
    let html = `
                ANNO: ${ANNO}<br/>
                NAME: ${NAME}<br/>
                BUNU: ${BUNU}<br/>
                KIND: ${KIND}<br/>
                NMLY: ${NMLY}<br/>
                RDNM: ${RDNM}<br/>
                SERV: ${SERV}<br/>
                SHAPE_Area: ${SHAPE_Area}<br/>
                SHAPE_Leng: ${SHAPE_Leng}<br/>
                UFID: ${UFID}<br/>
                geom_Area: ${geom_Area}<br/>
                geom_Lengt: ${geom_Lengt}<br/>
                layer: ${layer}
            `
    let popup = new mapboxgl.Popup({offset: popupOffsets, className: 'my-class'})
        .setLngLat(e.lngLat)
        .setHTML(html)
        .setMaxWidth("300px")
        .addTo(map);
})


map.on('idle', function() {
    if(map.getLayer("3D-extrusions-click")) {
        let toggleableLayerIds = ["3D-extrusions-click"];
        for(i = 0 ; i < toggleableLayerIds.length ; i++) {
            let id = toggleableLayerIds[i];
            if(!document.getElementById(id)) {
                let link = document.createElement("a");
                link.id = id;
                link.href = "#"
                link.textContent = id;
                link.className = "active";
                let selectBox = document.createElement("select");
                let heightOptionsArr = [...Array(30).keys()];
                let html = "";
                heightOptionsArr.map(item => html += `<option value=${item}>${item}층</option>`)
                selectBox.innerHTML = html;
                
                
                selectBox.onchange = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const all_features = map.queryRenderedFeatures({
                        layers: ["3D-extrusions-click"]
                    });
                    all_features.map(feature => {
                        map.setFeatureState(
                            { source: "composite", sourceLayer: "merged-0mpwhz", id: feature.id },
                            { heightFilterValue: parseInt(e.target.value) }
                        )
                    }) 
                }
                link.onclick = function (e) {
                    let clickedLayer = this.textContent;
                    e.preventDefault();
                    e.stopPropagation();
                    let visibility = map.getLayoutProperty(
                        clickedLayer,
                        'visibility'
                    );
                    if(visibility === 'visible') {
                        map.setLayoutProperty(
                            clickedLayer,
                            'visibility',
                            'none'
                        );
                        this.className = "";
                    } else {
                        this.className = "active";
                        map.setLayoutProperty(
                            clickedLayer,
                            'visibility',
                            'visible'
                        );
                    }
                };
                let layers = document.getElementById("menu");
                layers.appendChild(link);
                let selectBoxContainer = document.getElementById("selectHeight");
                selectBoxContainer.appendChild(selectBox);
            }
        }
    }
})