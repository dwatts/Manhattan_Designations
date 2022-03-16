require(["esri/WebScene", "esri/views/SceneView", "esri/layers/SceneLayer", "esri/layers/FeatureLayer", "esri/layers/WebTileLayer", "esri/core/watchUtils"], (WebScene, SceneView, SceneLayer, FeatureLayer, WebTileLayer, watchUtils) => {

  // Add Vector Basemap

  /*const nycBaseMap = new VectorTileLayer({
      url:"https://tiles.arcgis.com/tiles/uX5kr9HIx4qXytm9/arcgis/rest/services/Manhattan_Basemap_V2/VectorTileServer",
  });*/

  /*const stamen = new WebTileLayer({
    urlTemplate: "https://stamen-tiles-{subDomain}.a.ssl.fastly.net/toner/{level}/{col}/{row}.png",
    subDomains: ["a", "b", "c", "d"],
    copyright:
      `Map tiles by <a href="http://stamen.com/">Stamen Design</a>,
       under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.
       Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>,
       under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.`
  });*/

  const stamen = new WebTileLayer({
    urlTemplate: 'http://{subDomain}.basemaps.cartocdn.com/light_all/{level}/{col}/{row}.png',
    subDomains: ["a","b","c"],
    copyright: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    visible: true
  })

  // Individual Landmarks Boundaries

  const manhattanMask = new FeatureLayer({
    url:
      "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/Manhattan_Mask/FeatureServer",
    elevationInfo: {
      mode: "on-the-ground",

    },
    maxScale: 0,
    minScale: 0,  
    renderer: {
        type: "simple",
        symbol: {
          type: "polygon-3d",
          symbolLayers: [{
            type: "fill",
            material: {
              color: [255,255,255, 1]
            },
            outline: {
              color: "#000",
              width: 2, 
              style: "solid"
            }
          }]
        }
      }
  });

  // Individual Landmarks Boundaries

  const indLandBounds = new FeatureLayer({
    url:
      "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/MN_Ind_Landmarks/FeatureServer",
    elevationInfo: {
      mode: "on-the-ground",

    },
    maxScale: 0,
    minScale: 0,  
    renderer: {
        type: "simple",
        symbol: {
          type: "polygon-3d",
          symbolLayers: [{
            type: "fill",
            material: {
              color: [225,145,181, 0.4]
            },
            outline: {
              color: "#7d0139",
              width: 1, 
              style: "solid"
            }
          }]
        }
    },
    popupEnabled: true,
    popupTemplate: {
      content: "<h1>{lpc_name}<br>{lpc_lpnumb}</h1>"
    }
  });

  // Historic district boundaries

  const histDistBounds = new FeatureLayer({
    url:
      "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/MN_HistoricDistricts/FeatureServer",
    elevationInfo: {
      mode: "on-the-ground",

    },
    maxScale: 0,
    minScale: 0, 
    popupEnabled: false,
    renderer: {
        type: "simple",
        symbol: {
          type: "polygon-3d",
          symbolLayers: [{
            type: "fill",
            material: {
              color: [249,223,97, 0.4]
            },
            outline: {
              color: "#8a7201",
              width: 1, 
              style: "solid"
            }
          }]
        }
      }
  });

  // Interior Landmarks Points

  var intRendererSmall = {
    type: "simple",
    symbol: {
      type: "point-3d", 
        symbolLayers: [
          {
            type: "icon",
            material: {
              color: [36,106,230]
            },
            size: 5,
            outline: {
              color: "#404040",
              size: 1
            }
          }
        ],
    }   
  };

  var intRendererMedium = {
    type: "simple",
    symbol: {
      type: "point-3d", 
        symbolLayers: [
          {
            type: "icon",
            material: {
              color: [36,106,230]
            },
            size: 8,
            outline: {
              color: "#404040",
              size: 1
            }
          }
        ],
    }   
  };

  var intRendererLarge = {
    type: "simple",
    symbol: {
      type: "point-3d", 
        symbolLayers: [
          {
            type: "icon",
            material: {
              color: [36,106,230]
            },
            size: 15,
            outline: {
              color: "#404040",
              size: 1
            }
          }
        ],
    }   
  };

  const interiorPoints = new FeatureLayer({
    url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/Interior_Landmarks/FeatureServer",
    popupEnabled: true,
    renderer: intRendererSmall,
    popupEnabled: true,
    popupTemplate: {
      content: "<h1>{LM_NAME}</h1>"
    },
    elevationInfo: {
      mode: "relative-to-scene",
      offset: 10
    },
    screenSizePerspectiveEnabled: true,
  });

  
  // Renderer for Designated Buildings

  var desEdges = {
    type: "solid",
    color: [0, 0, 0, 0.5],
    size: .5
  };   
    
  var histDist = {
    type: "mesh-3d",
    symbolLayers: [
      {
        type: "fill",
        material: {
          color: "#e8a412"
        },
        edges: desEdges    
      } 
    ]  
  };
    
  var indDes = {
    type: "mesh-3d",
    symbolLayers: [
      {
        type: "fill",
        material: {
          color: "#e51aaf"
        },
        edges: desEdges    
      } 
    ]  
  };


  const desRenderer = {
    type: "unique-value",
    defaultSymbol: {
      type: "mesh-3d",
      symbolLayers: [
        {
          type: "fill", 
          material: {
            color: "#000" // Color for forts with no year data #baa9a9
          },
          edges: desEdges  
        }
      ]
    },
    field: "DesType",
    uniqueValueInfos: [
      {
        value: "HD",
        symbol: histDist,
      },
      {
        value: "IL",
        symbol: indDes,
      } 
    ],
  };

  var desBuildingTemplate = {
    outFields: ["*"],
    content: function (feature) {
      return setContentInfo(feature.graphic.attributes);
    },    
  };

  const desBuildings = new SceneLayer({                    
    url: "https://tiles.arcgis.com/tiles/uX5kr9HIx4qXytm9/arcgis/rest/services/Designated_3D_Buildings/SceneServer",
    //outFields: ["*"], 
    popupTemplate: desBuildingTemplate,
    /*popupTemplate: {
      content: "<h1>{des_name}</h1>"
    },*/                   
    renderer: desRenderer,
  });

  function setContentInfo(results) {
    
      const materials = (
        (results.mat_prim != "0" && results.mat_sec == "0" && results.mat_third == "0" && results.mat_four == "0" && results.mat_other == "0") ? "<h2>Building Materials: " + results.mat_prim + "</h2>" :
        (results.mat_prim != "0" && results.mat_sec != "0" && results.mat_third == "0" && results.mat_four == "0" && results.mat_other == "0") ? "<h2>Building Materials: " + results.mat_prim + ", " + results.mat_sec + "</h2>"  :
        (results.mat_prim != "0" && results.mat_sec != "0" && results.mat_third != "0" && results.mat_four == "0" && results.mat_other == "0") ? "<h2>Building Materials: " + results.mat_prim + ", " + results.mat_sec + ", " + results.mat_third + "</h2>" :
        (results.mat_prim != "0" && results.mat_sec != "0" && results.mat_third != "0" && results.mat_four != "0" && results.mat_other == "0") ? "<h2>Building Materials: " +results.mat_prim + ", " + results.mat_sec + ", " + results.mat_third + ", " + results.mat_four + "</h2>" :
        (results.mat_prim != "0" && results.mat_sec != "0" && results.mat_third != "0" && results.mat_four != "0" && results.mat_other != "0") ? "<h2>Building Materials: " + results.mat_prim + ", " + results.mat_sec + ", " + results.mat_third + ", " + results.mat_four + ", " + results.mat_other + "</h2>" :
        ''
      );

      const styles = (
        (results.style_prim != "0" && results.style_sec == "0" && results.style_oth == "0") ? "<h2>Architectural Style: " + results.style_prim + "</h2>" :
        (results.style_prim != "0" && results.style_sec != "0" && results.style_oth == "0") ? "<h2>Architectural Styles: " + results.style_prim + ", " + results.style_sec + "</h2>" :
        (results.style_prim != "0" && results.style_sec != "0" && results.style_oth != "0") ? "<h2>Architectural Styles: " + results.style_prim + ", " + results.style_sec + ", " + results.style_oth + "</h2>" :
        ''
      )

      const altYears = (
        (results.alt_date_1 != "0" && results.alt_arch_1 != "0") ? "<h2>Major Alterations: " + results.alt_date_1 + " (" + results.alt_arch_1 + ")</h2>" :
        (results.alt_date_1 != "0" && results.alt_arch_1 != "0" && results.alt_date_2 != "0" && results.alt_arch_2 != "0") ? "<h2>Major Alterations: " + results.alt_date_1 + " (" + results.alt_arch_1 + "), " + results.alt_date_2 + " (" + results.alt_arch_2 + ")</h2>" :
        ''   
      );

      const buildingName = (
        (results.build_nme != 0) ? "<h2>Building Name: " + results.build_nme + "</h2>" :
        (results.build_nme == 0) ? '' :
        ''
      );

      const altered = (
        (results.altered == 1) ? altYears :
        (results.altered == 0) ? "<h2>Major Alterations: None</h2>" :
        ''
      );

      const notes = (
        (results.notes != 0) ? "<h2>Notes: " + results.notes + "</h2>" :
        (results.notes == 0) ? '' :
        ''
      );

      /*****Create Link to full Luna Collection******/

      var linkStart = "https://nyclandmarks.lunaimaging.com/luna/servlet/view/search?q=lp_number=%22"
      var lpNum = results.lp_num
      var linkEnd = "%22"

      var fullLink = linkStart + lpNum + linkEnd;

      /*****Code to Get Luna Images******/

      var rootStart = "https://nyclandmarks.lunaimaging.com/luna/servlet/as/search?q=landmark_type%3D"
  
      var bin = results.BIN
      var desType = (results.DesType == "IL") ? "Individual+Landmark" : "Historic+District";

      var and = "+AND+bin%3D"
      //console.log(bin);

      var rootEnd = "&os=0&bs=10&excludeFacets=1&excludeMetadata=1"

      console.log(rootStart+desType+and+bin+rootEnd);

      //Luna URL and Ajax Code

      var getUrl = function () {
        var tmp = [];
        $.ajax({
            'async': false,
            'type': "GET",
            //'global': false,
            'dataType': 'json',
            'url': rootStart+desType+and+bin+rootEnd,
            success: function(data) {  
              $.each(data.results, function(index, value) {
                tmp.push(value.urlSize4);
              });
            },
        });
        return tmp;
      }();

      var length = getUrl.length
      console.log(getUrl);

      //Set initial Image Source 

      let image = getUrl[0];
   
      //Slide Code//

      let slides = getUrl;
      let currentSlideIndex = 0;
      

      function show_image(direction) {
        
        let currentImage = document.getElementById("slideImg");
        currentImage.src = slides[currentSlideIndex];

        if (direction == 'left') {
          currentSlideIndex--;
        }
        else {
          currentSlideIndex++;
          currentSlideIndex %= slides.length;
        }
        if (currentSlideIndex < 0) {
          currentSlideIndex = slides.length - 1;
        }
        currentImage.src = slides[currentSlideIndex];
        
        counter = currentSlideIndex +1;
        $('#counterText').text(counter);
      };

      length = getUrl.length;

      $(document).on("click" , '#left' , function(){
        show_image('left'); 
      });

      $(document).on("click" , '#right' , function(){
        show_image('right'); 
      });

      /*****End code to Get Luna Images******/

      var popupElement = document.createElement("div");

      if (results.DesType == "IL") {
        popupElement.innerHTML = "<img id='slideImg' src='" + image + "' class='popupImage'></img><div id='buttonHolder'><button id='left'><i class='fa-solid fa-circle-arrow-left'></i></button><div id='counterHolder'><h4>Image</h4><h4 id='counterText'>1</h4><h4>/</h4><h4 id='totaltext'>" + length + "</h4></div><button id='right'><i class='fa-solid fa-circle-arrow-right'></i></button></div><h2><a href=" + fullLink + " target='_blank'>See the entire image collection</a></h2><h1>" + results.des_name + " (" + results.lp_num + ")</h1><h2>Designation Date: " + results.des_date + "</h2>" + buildingName + "<h2>" + results.des_addres + "</h2><h2>Constructed: " + results.date_combo + "</h2><h2>Architect/Builder: " + results.arch_build + "</h2> <h2>Owner/Developer: " + results.own_devel + "</h2>" + styles + materials + altered + notes + "<h2><a href=" + results.url_report + " target='_blank'>Read the designation report</a></h2>";
      } else if (results.DesType == "HD") {
        popupElement.innerHTML = "<img id='slideImg' src='" + image + "' class='popupImage'></img><div id='buttonHolder'><button id='left'><i class='fa-solid fa-circle-arrow-left'></i></button><div id='counterHolder'><h4>Image</h4><h4 id='counterText'>1</h4><h4>/</h4><h4 id='totaltext'>" + length + "</h4></div><button id='right'><i class='fa-solid fa-circle-arrow-right'></i></button></div><h2><a href=" + fullLink + " target='_blank'>See the entire image collection</a></h2><h1>" + results.des_name + " (" + results.lp_num + ")</h1><h2>Designation Date: " + results.des_date + "</h2>" + buildingName + "<h2>" + results.des_addres + "</h2><h2>Constructed: " + results.date_combo + "</h2><h2>Architect/Builder: " + results.arch_build + "</h2> <h2>Owner/Developer: " + results.own_devel + "</h2>" + styles + materials + altered + notes + "<h2><a href=" + results.url_report + " target='_blank'>Read the designation report</a></h2>";
      } else {
        popupElement.innerHTML = "<h1>" + results.des_name + "</h1>";
      }

      return popupElement;
  };

  const nondesBuildings = new SceneLayer({                    
      url:"https://tiles.arcgis.com/tiles/uX5kr9HIx4qXytm9/arcgis/rest/services/NonDesignated_3D_Buildings/SceneServer",
      popupEnabled: false,
      opacity: 0.8,                       
  });

  const nondesRenderer = {
    type: "mesh-3d",
    symbolLayers: [
      {
        type: "fill",
        material: {
          color: [224, 224, 224]
        },
        edges: {
          type: "solid",
          color: [0, 0, 0, 0.5],
          size: .5
        }
      }
    ]
  };

  nondesBuildings.renderer = {
    type: "simple",
    symbol: nondesRenderer
  };

  const hbdb = new FeatureLayer({
      url: "https://services5.arcgis.com/Oos4pNA2538iVFA1/arcgis/rest/services/LPC_HistoricBuildings_Service/FeatureServer",
      outFields: ["*"],
      visible: false,
      definitionExpression: "Borough = 'MN'"
  });

  var webscene = new WebScene({
      layers: [ /*nycBaseMap,*/ manhattanMask, stamen, hbdb, histDistBounds, indLandBounds, desBuildings, nondesBuildings, interiorPoints ],
      basemap: stamen,
      ground: "world-elevation"
  });

  webscene.ground.opacity = 0

  const view = new SceneView({
    container: "viewDiv",
    map: webscene,
    qualityProfile: "low",
    camera: {
      position: {
        latitude: 40.6982448055282,
        longitude: -73.99870704505963,
        z: 2107.3311000000685
      },
      tilt: 39.93249999998931,
      heading: 334.2607865495843
    },
    popup: {
        collapseEnabled: false,
        dockEnabled: true,
        dockOptions: {
            buttonEnabled: false,
            breakpoint: false
        }
    },
    environment: {
      background:{
          type: "color", 
          color: [255,255,255,1]
      },
      lighting: {
          directShadowsEnabled: true
        },  
      atmosphereEnabled: false,
      starsEnabled: false
    }
  });

  view.popup.viewModel.includeDefaultActions = false;

  /* Change Interior Points Renderer */

  view.when().then(function() {     
          view.watch("scale", function(newValue) {
          if (newValue <= 3000) {
            return interiorPoints.renderer = intRendererLarge
          } else if (newValue > 3000 && newValue <= 6000) {
            return interiorPoints.renderer = intRendererMedium
          } else if (newValue > 6000) {
            return interiorPoints.renderer = intRendererSmall
          } else {
            return interiorPoints.renderer = intRendererMedium
          }
      })
  });


  watchUtils.whenTrue(view.popup,'visible', function(){
    watchUtils.whenFalseOnce(view.popup,'visible', function(){
      getUrl = [];
      console.info(getUrl);
    })
  });


  view.watch('camera.tilt', function(newValue, oldValue, property, object) {
    console.log(property , newValue);
  });
    
  view.watch('camera.position', function(newValue, oldValue, property, object) {
    console.log(property , newValue);
  });
    
  view.watch('camera.heading', function(newValue, oldValue, property, object) {
    console.log(property , newValue);
  });

  /****************Zoom to Layer Code for Filter**********/ 

  /*function zoomToLayer(layerView) {
    return layerView.queryExtent().then(function (response) {
      view.goTo(response.extent).catch(function (error) {
        if (error.name != "AbortError") {
          console.error(error);
        }
      });
    });
  }*/  

  //Looping Code 1//

  /*view
  .when(function() {
    return hbdb.when(function() {
      var query = hbdb.createQuery();
      return hbdb.queryFeatures(query);
    });
  })
  .then(getValues)
  .then(getUniqueValues)
  .then(addToSelect);

  function getValues(response) {
    var features = response.features;
    var values = features.map(function(feature) {
      return feature.attributes.Hist_Dist;
    });
    return values;
  }

  function getUniqueValues(values) {
    var uniqueValues = [];

    values.forEach(function(item, i) {
      if (
        (uniqueValues.length < 1 || uniqueValues.indexOf(item) === -1) &&
        item !== ""
      ) {
        uniqueValues.push(item);
      }
    });
    return uniqueValues;
  }

  function addToSelect(values) {
    values.sort();
    values.forEach(function(value) {
      var option = document.createElement("option");
      option.text = value;
      filterOne.add(option);
    });
  }

  //Looping Code 2

  view
    .when(function() {
      return hbdb.when(function() {
        var queryTwo = hbdb.createQuery();
        return hbdb.queryFeatures(queryTwo);
      });
    })
    .then(getValuesTwo)
    .then(getUniqueValuesTwo)
    .then(addToSelectTwo);

  function getValuesTwo(response) {
    var features = response.features;
    var values = features.map(function(feature) {
      return feature.attributes.Mat_Prim;
    });
    return values;
  }

  function getUniqueValuesTwo(values) {
    var uniqueValues = [];

    values.forEach(function(item, i) {
      if (
        (uniqueValues.length < 1 || uniqueValues.indexOf(item) === -1) &&
        item !== ""
      ) {
        uniqueValues.push(item);
      }
    });
    return uniqueValues;
  }

  function addToSelectTwo(values) {
    values.sort();
    values.forEach(function(value) {
      var option = document.createElement("option");
      option.text = value;
      filterThree.add(option);
    });
  }*/

  ///////////  Filter Code ///////////

  /*let flView = null;
  view.whenLayerView(desBuildings).then(layerView => flView = layerView);

  // filter logic

  let selectedHD = null;
  let selectedEra = null;
  let selectedMat = null;
  const updateFilter = function() {
    let conditions = [];
    if (selectedHD) {
      conditions.push(`(hist_dist='${selectedHD}')`);
    }
    if (selectedEra) {
      conditions.push(`(ERA='${selectedEra}')`);
    }
    //Start third filter test//
    if (selectedMat) {
      conditions.push(`(mat_prim='${selectedMat}')`);
    }
    //End third filter test//
    flView.filter = conditions.length > 0 ? {where: conditions.join("AND")} : null;
    console.log(flView.filter && flView.filter.where);
  }

  // click event handlers

  const filterByHD = (event) => {
    selectedHD = event.target.value;
    updateFilter();
  }
  const filterByEra = (event) => {
    selectedEra = event.target.value;
    updateFilter();
  }
  const filterByMat = (event) => {
    selectedMat = event.target.value;
    updateFilter();
  }

  // listen click events

  filterOne.addEventListener('click', filterByHD);
  filterTwo.addEventListener("click", filterByEra);
  filterThree.addEventListener("click", filterByMat);

  */
  //////////// End Filter Code //////////////



});