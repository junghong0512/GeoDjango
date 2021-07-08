
const KIND_OBJ = {
    "BDK000": "미분류",
    "BDK001": "일반주택",
    "BDK002": "연립주택",
    "BDK003": "아파트",
    "BDK004": "주택외건물",
    "BDK005": "무벽건",
    "BDK006": "온실",
    "BDK007": "공사중건물",
    "BDK008": "가건물",
}

const SERV_OBJ = {
    "BDS000": "미분류",
    "BDS001": "주택",
    "BDS002": "근린생활시설",
    "BDS003": "문화및집회시설",
    "BDS004": "종교시설",
    "BDS005": "판매시설",
    "BDS006": "운수시설",
    "BDS007": "의료시설",
    "BDS008": "교육연구시설",
    "BDS009": "노유자(노인및어린이)시설",
    "BDS010": "수련시설",
    "BDS011": "운동시설",
    "BDS012": "업무시설",
    "BDS013": "숙박시설",
    "BDS014": "위락시설",
    "BDS015": "공장",
    "BDS016": "창고시설",
    "BDS017": "위험물저장및처리시설",
    "BDS018": "자동차관련시설",
    "BDS019": "동물및식물관련시설",
    "BDS020": "분뇨및쓰레기처리시설",
    "BDS021": "교정및군사시설",
    "BDS022": "방송통신시설",
    "BDS023": "발전시설",
    "BDS024": "묘지관련시설",
    "BDS025": "관광휴게시설",
    "BDS026": "장례시설",
    "BDS999": "기타시설",
}

mapboxgl.accessToken = 'pk.eyJ1IjoianVuZ2hvbmciLCJhIjoiY2twbnBiZTA3MXQ3NjJ2bHJodHJmN2oyYSJ9.QW798Vk3hHy6I158OoHDzg';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/junghong/ckqrasy9j3rm618uoethm0itp', // style URL
    center: [127.047956, 37.504059],// starting position [lng, lat]
    zoom: 17, // starting zoom
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
        filter: ["!=", "extrude", "true"],  // 변경할 부분 예상(geojson에 맞게)
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
                "#AB1",
                ["==", ["get", "NMLY"], ["feature-state", "heightFilterValue"]],
                "#555",
                ["has", ["get", "KIND"], ["feature-state", "selected_kind"]],
                "#F15",
                ["has", ["get", "SERV"], ["feature-state", "selected_serv"]],
                "#456",
                "#FFF",
            ],
            "fill-extrusion-height": ["*", ["get", "NMLY"], 2],
            "fill-extrusion-opacity": 0.8,
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
    new mapboxgl.Popup({offset: popupOffsets, className: 'my-class'})
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

                // Select BOX 생성 후, 선택 된 층 필터 반영
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
                
                // 건물 종류 구분을 위한 SELECT BOX
                let kindCheckBoxContainer = document.createElement("div");
                let kindHtml = '';

                for(let kind in KIND_OBJ) {
                    let inputHtml = `<input type='checkbox' name='kindobj_checkbox' value=${kind} id=${kind} />`;
                    let labelHtml = `<label class='checkbox' for=${kind}>${KIND_OBJ[kind]}</label>`;
                    kindHtml += (inputHtml + labelHtml + '</br>');
                }
                let submitKindBtn = '<button id="submitBtn" onClick="getCheckedKindValue()">확인</button>';
                kindHtml += submitKindBtn;
                kindCheckBoxContainer.innerHTML = kindHtml;

                // 건물 용도 구분을 위한 SELECT BOX
                let checkboxesContainer = document.createElement("div");
                let yongdoHtml = '';

                for(let yongdo in SERV_OBJ) {
                    let inputHtml = `<input type='checkbox' name='servobj_checkbox' value=${yongdo} id=${yongdo} />`;
                    let labelHtml = `<label class='checkbox' for=${yongdo}>${SERV_OBJ[yongdo]}</label>`;
                    yongdoHtml += (inputHtml + labelHtml + '<br/>');
                }
                let submitBtn = '<button id="submitBtn" onClick="getCheckedValue()">확인</button>';
                yongdoHtml += submitBtn;
                checkboxesContainer.innerHTML = yongdoHtml;
                

                // Click 시 해당 건물 Highlight
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
                let yongdo = document.getElementById("yongdoContainer");
                yongdo.appendChild(checkboxesContainer)
                let kind = document.getElementById("kindContainer");
                kind.appendChild(kindCheckBoxContainer)
            }
        }
    }
})



const getCheckedKindValue = (e) => {
    const query = 'input[name="kindobj_checkbox"]:checked';
    const selectedEles = document.querySelectorAll(query);
    let selectedKindObj = {};
    selectedEles.forEach((el) => {
        selectedKindObj[el.value] = el.value;
    })
    const all_features = map.queryRenderedFeatures({
        layers: ["3D-extrusions-click"]
    });
    all_features.map(feature => {
        map.setFeatureState(
            { source: "composite", sourceLayer: "merged-0mpwhz", id: feature.id },
            { selected_kind:  selectedKindObj}  
        )
    })
}

const getCheckedValue = (e) => {
    const query = 'input[name="servobj_checkbox"]:checked';
    const selectedEles = document.querySelectorAll(query);
    let selectedObj = {};
    selectedEles.forEach((el) => {
        selectedObj[el.value] = el.value;
    })
    const all_features = map.queryRenderedFeatures({
        layers: ["3D-extrusions-click"]
    });
    all_features.map(feature => {
        map.setFeatureState(
            { source: "composite", sourceLayer: "merged-0mpwhz", id: feature.id },
            { selected_serv:  selectedObj}  
        )
    })
}