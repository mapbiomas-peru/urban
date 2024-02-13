/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var inclusion = 
    /* color: #3614d6 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-76.3237420310458, -6.473597994969973],
                  [-76.32460027565135, -6.471721832052054],
                  [-76.32717516878479, -6.468694227028139],
                  [-76.32837676102088, -6.469077979381582],
                  [-76.32631677053199, -6.475303635276085]]]),
            {
              "value": 1,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-75.28225959268576, -12.070921921023006],
                  [-75.28080047098166, -12.075706055229242],
                  [-75.27989924875266, -12.075999815071377],
                  [-75.27891219583518, -12.074195285237268],
                  [-75.28144420114523, -12.07008259042314]]]),
            {
              "value": 1,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([-75.28034734147106, -12.070754370815772]),
            {
              "value": 1,
              "system:index": "2"
            })]),
    exclusion = /* color: #ff0000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-76.3634815709856, -6.488607687549568],
                  [-76.36124997308521, -6.485196440535515],
                  [-76.36794476678638, -6.487243191515146]]]),
            {
              "value": 1,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([-75.28415113289725, -12.046256293427193]),
            {
              "value": 1,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-75.2817478736199, -12.047179638964941],
                  [-75.27513891060721, -12.05104086771276],
                  [-75.27101903756034, -12.04860662127684],
                  [-75.27539640267264, -12.044577475223337]]]),
            {
              "value": 1,
              "system:index": "2"
            })]),
    geometry_27 = 
    /* color: #b1b1b1 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([-75.22726422311204, -12.121425107576405]),
            {
              "id": 27,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([-75.22949582101243, -12.123061485514663]),
            {
              "id": 27,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-75.22832940385364, -12.125315784377005],
                  [-75.2257115678551, -12.122756338650506],
                  [-75.22910188004992, -12.120574496673093]]]),
            {
              "id": 27,
              "system:index": "2"
            })]),
    geometry_24 = 
    /* color: #ff0000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([-75.22007541465955, -12.054990014443074]),
            {
              "id": 24,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-75.22120799501116, -12.058894684878398],
                  [-75.21580066163713, -12.05847500107775],
                  [-75.21618689973528, -12.05457191028158],
                  [-75.22232379396135, -12.05591491567359]]]),
            {
              "id": 24,
              "system:index": "1"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// training for classification of urban areas COL5
// date: 14/06/2023
            
var param = {
  region: 70304,
  country: 'PERU',
  trees: 50,
  yearsPreview: [2021, 2022],
  _print: true,
  tileScale: 8,
  inputVersionSample: '1',
  outVersionClass: '1',
  GlobalSurfaceWater: 1,
  additionalSamples: {
    //polygons: [ geometry_24, geometry_27],
    polygons: [ ],
    classes: [ 24, 27 ], // clases en orden de las geometrias
    points: [10, 10]   //Numero de muestras a agregar en cada clase
  },
  classificationArea : {   // Para Incluir o exluir el Area de clasificacion con el Buffer 
      MaskArea :{
        col: 'COLECCION4', // COLECCION4, COLECCION5
        versionClassArea: '1',   // Area de clasificacion con el Buffer  //COLECCION 4
         },
        inclusion: inclusion,
        exclusion: exclusion,
      shapefile : {
        useshp: false,   // Usar geometrias ya creadas en pasos posteriores usado para ciclo2
        col: 'COLECCION4', // COLECCION4, COLECCION5
        step: 'step3',  // 'step2', 'step3'
        shpVersion: '1',
             }
  }
};

// featureSpace
var featureSpace = [
  "blue_median",
  "green_median",
  "red_median",
  "red_wet",
  "nir_median",
  "nir_wet",
  "swir1_median",
  "swir2_median",
  "ndvi_median",
  "ndvi_wet",
  "wefi_wet",
  "gcvi_wet",
  "sefi_median",
  "soil_median",
  "snow_median",
  "evi2_median",
  "ndwi_mcfeeters_median",
  "mndwi_median",
  "slope",
  "slppost",
  "elevation",
  "shade_mask2",
  "nuaci_median2"
];


var Urban = function(param){
  
  this.param = param;
  
  this.inputs = {
    mosaics: [
            'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2',
            'projects/mapbiomas-raisg/MOSAICOS/mosaics-2'
    ],
    _regions : 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-urban-5',
    _clasificacionArea: 'projects/mapbiomas-raisg/MUESTRAS/'+param.country+'/COLECCION5/TRANSVERSALES/URBANA/STEP1_REGIONS/URBANA-REF-ACCUM-'+param.country+ '-'+ param.region +'-' + param.classificationArea.MaskArea.versionClassArea,
    samples: 'projects/mapbiomas-raisg/MUESTRAS/'+param.country+'/COLECCION5/TRANSVERSALES/URBANA/',
    result: 'projects/mapbiomas-raisg/TRANSVERSALES/'+param.country+'/COLECCION5/URBANA/clasificacion/',
    urbana_all_ref: 'projects/mapbiomas-raisg/MOSAICOS/Urbana_all_ref_v2',
    STEP3_GEOMETRY: 'projects/mapbiomas-raisg/MUESTRAS/'+param.country+'/COLECCION5/TRANSVERSALES/URBANA/STEP3_GEOMETRY/urban-'+ param.region + '-' + param.country + '-' + param.classificationArea.shapefile.shpVersion,
    STEP2_GEOMETRY: 'projects/mapbiomas-raisg/MUESTRAS/'+param.country+'/COLECCION5/TRANSVERSALES/URBANA/STEP2_GEOMETRY/urban-'+ param.region + '-' + param.country + '-' + param.classificationArea.shapefile.shpVersion,
    years: [
      // 1985, 1986, 1987, 1988, 
      // 1989, 1990, 1991, 1992, 
      // 1993, 1994, 1995, 1996, 
      // 1997, 1998, 1999, 2000, 
      // 2001, 2002, 2003, 2004, 
      // 2005, 2006, 2007, 2008, 
      // 2009, 2010, 2011, 2012, 
      // 2013, 2014, 2015, 2016, 
      // 2017, 2018, 2019, 2020,
      // 2021,
      2022
    ],
    palette: require('users/mapbiomas/modules:Palettes.js').get('classification2')
  };
  
  
  
  this.init = function(param){
    
    // Set satellite as default view
    Map.setOptions({
      mapTypeId: 'SATELLITE'
    });
    
    // Inputs and parms
    var _this = this;
    var regionId = param.region;
    var regionAsset = _this.inputs._regions;
    var country = param.country;
    var thesGSW = param.GlobalSurfaceWater
    var assetclassArea = _this.inputs._clasificacionArea;
    var urbana_all_ref = _this.inputs.urbana_all_ref;
    
    
    var additionalSamples = param.additionalSamples;
    
    var variables = featureSpace;
    var trees = param.trees;
    var _print = param._print;
    var version_input = param.inputVersionSample.toString();
    var version_out = param.outVersionClass.toString();
    var palette = _this.inputs.palette;
    
    var samplesPath = _this.inputs.samples;
    var assetMosaics = _this.inputs.mosaics;
    var years = _this.inputs.years;
    var outputPath = _this.inputs.result;
    
    
    // GEOMETRIAS de Inclusion y exclusion
    var AssetSHPIncluExclu;
    if(param.classificationArea.shapefile.step == 'step2')
    {
      AssetSHPIncluExclu = _this.inputs.STEP2_GEOMETRY 
      
    } else if(param.classificationArea.shapefile.step == 'step3'){
      AssetSHPIncluExclu = _this.inputs.STEP3_GEOMETRY
    }
    
  AssetSHPIncluExclu = AssetSHPIncluExclu.replace('COLECCION5', param.classificationArea.shapefile.col)
  print('AssetSHPIncluExclu',AssetSHPIncluExclu)
    
    // Region
    var region = _this._getRegion(regionAsset, regionId);
    var regionMask = region.rasterMask;
    var regionLayer = region.vector;
      print(regionLayer)
    Map.addLayer(regionLayer,{}, 'region',true)

    // Mosaics
    var mosaic = this.getMosaic( assetMosaics, regionId);
    
    print(mosaic.size())
    
    assetclassArea = assetclassArea.replace('COLECCION5', param.classificationArea.MaskArea.col)
     print('assetclassArea',assetclassArea)
    var classArea = ee.Image(assetclassArea).updateMask(regionMask)
        // classArea = _this.inclus_exclu(classArea, param.classificationArea.inclusion, param.classificationArea.exclusion);
    
    if(param.classificationArea.shapefile.useshp){
      var inclusionSHP = ee.FeatureCollection(AssetSHPIncluExclu).filter(ee.Filter.eq('type', 'inclusion'));
      var exclusionSHP = ee.FeatureCollection(AssetSHPIncluExclu).filter(ee.Filter.eq('type', 'exclusion'));
      classArea = _this.inclus_exclu(classArea, inclusionSHP, exclusionSHP);
      Map.addLayer(inclusionSHP,{},'inclusionSHP',false)
      Map.addLayer(exclusionSHP,{},'exclusionSHP',false)
    }
     
    classArea = _this.inclus_exclu(classArea, param.classificationArea.inclusion, param.classificationArea.exclusion);

    // All-years training polygons
    var samplesAsset = 'urban-' + regionId + '-' + country + '-' + version_input;
    var trainingSamples = ee.FeatureCollection(samplesPath + samplesAsset);
    
    // Define classifier
    var classifier = ee.Classifier.smileRandomForest({
        numberOfTrees: trees, 
        variablesPerSplit: 1
    });
    
    // Terrain
    var dem = ee.Image('JAXA/ALOS/AW3D30_V1_1').select("AVE");  
    var slope = ee.Terrain.slope(dem).rename('slope');
    var slppost = ee.Image('projects/mapbiomas-raisg/MOSAICOS/slppost2_30_v3').rename('slppost')
    var shadeMask2 = ee.Image("projects/mapbiomas-raisg/MOSAICOS/shademask2_v3").rename('shade_mask2')
    var water = ee.Image("JRC/GSW1_2/GlobalSurfaceWater")
              .select('occurrence')
              .gte(thesGSW)
    
    var classifiedImage = ee.Image().byte();
    
     var geom = ee.FeatureCollection(
        regionLayer.geometry().bounds()
      )
      .map(function(item) {
        return item.set('version', 1);
      })
      .reduceToImage(['version'], ee.Reducer.first());
    var urbana_all_ref_raster = ee.Image(urbana_all_ref)
    // Iterate by years
    years.forEach(function(year) {
      
      // Mosaics
      var yearMosaic = mosaic.filter(ee.Filter.eq('year', year))
                            .filterBounds(regionLayer)
                            .median()
                            .addBands(dem.rename('elevation'))
                            .addBands(slope)
                            .addBands(slppost)
                            .addBands(shadeMask2)
                            .updateMask(regionMask);
                            
      yearMosaic = _this.newIndex(yearMosaic, urbana_all_ref_raster, 1)    
       
      var yearMosaicSel = yearMosaic.select(featureSpace)
      
    // if(useOSM){
    //     yearMosaic = yearMosaic.updateMask(OSM_buffer)
    // }
      yearMosaicSel = yearMosaicSel.updateMask(yearMosaicSel.select('blue_median')).updateMask(classArea);
      
      
      Map.addLayer(yearMosaic, {
          bands: ['swir1_median', 'nir_median', 'red_median'],
          gain: [0.08, 0.06, 0.2]
        }, 
        'MOSAICO ' + year, 
        false
      );
      

      // Samples
      var yearSamples = trainingSamples.filterMetadata('year', 'equals', year)
        .map(function(feature){
          return _this.removeProperty(feature, 'year');
        });
        
      // Here we put additional samples
      if(additionalSamples.polygons.length > 0){
        
        var insidePolygons = ee.FeatureCollection(additionalSamples.polygons)
          .flatten()
          .reduceToImage(['id'], ee.Reducer.first());
        
        var outsidePolygons = insidePolygons.mask().eq(0).selfMask();
        outsidePolygons = geom.updateMask(outsidePolygons);
  
        
        var outsideVector = outsidePolygons.reduceToVectors({
          reducer: ee.Reducer.countEvery(),
          geometry: regionLayer.geometry().bounds(),
          scale: 30,
          maxPixels: 1e13
        });
  
        
        var newSamples = _this.resampleCover(yearMosaicSel, additionalSamples);
        
        
        yearSamples = yearSamples.filterBounds(outsideVector)
                                 .merge(newSamples);
      }
          
      // Classification
      var classified = _this.classifyRandomForests(
        yearMosaicSel, classifier, yearSamples
      );
      
      var name = 'classification_' + year.toString();
      
      classified = classified.where(water.eq(1), 27);
      classifiedImage = classifiedImage.addBands(classified.rename(name));

      
      
      // Display and exports
      Map.addLayer(classified.rename(name).updateMask(classArea), {
          min: 0, 
          max: 34,
          palette: _this.inputs.palette
        }, 
        'CLASIFICACION ' + year, 
        false
      );
      
      
    });
      Map.addLayer(classArea,
       {
        palette: 'fcff00'
       },'classArea',false
      );
    // Export image to asset
    var siteName = samplesAsset.toUpperCase() + '-RF-' + version_out;

    classifiedImage = classifiedImage.slice(1).updateMask(classArea).byte()
      .set({
        region: regionId,
        country: country,
        metodo: 'Random forest',
        version: version_out
      });
      
    if(_print) print(classifiedImage);

    Export.image.toAsset({
      image: classifiedImage,
      description: siteName,
      assetId: outputPath + siteName,
      region: regionLayer.geometry().bounds(),
      scale: 30,
      maxPixels: 1e13,
      pyramidingPolicy: {'.default': 'mode'},
    });
    
  };
  
  /**
 * Inclu exclu
 */
  this.inclus_exclu = function(capa, inclu, exclu){
             var inclusionRegions=  ee.FeatureCollection(inclu).reduceToImage(['value'], ee.Reducer.first())
                           .eq(1)
             var exclusionRegions=  ee.FeatureCollection(exclu).reduceToImage(['value'], ee.Reducer.first())
                           .eq(1)
             capa = capa.where(exclusionRegions.eq(1), 0).selfMask()        
             capa = ee.Image(0).where(capa.eq(1), 1)
                               .where(inclusionRegions.eq(1), 1).selfMask()
                               
      return capa
    };
    
    /**
   * Function for taking additional samples
   */
  this.resampleCover = function(mosaic, additionalSamples) {
    
    var polygons = additionalSamples.polygons,
        classIds = additionalSamples.classes,
        points = additionalSamples.points,
        newSamples = [];
    
    polygons.forEach(function(polygon, i) {
      
      var newSample = mosaic.sample({
        numPixels: points[ i ],
        region: polygon,
        scale: 30,
        projection: 'EPSG:4326',
        seed: 1,
        geometries: true,
        tileScale:param.tileScale
      })
      .map(function(item) { return item.set('reference', classIds[ i ]) });
      
      newSamples.push(newSample);
  
    });
    
    return ee.FeatureCollection(newSamples).flatten();
  
  };

  /**
   * Get mosaics
   * Get mosaics from collection2 asset. Then compute
   * Urbans indexes remaining.
   */
  this.getMosaic = function(paths, regionId) {
  
      // Additional variables
     // var shademask2_v1 = shademask2_v1.rename('shade_mask2')
      
      var mosaicRegion = regionId.toString().slice(0, 3);
      // añadimos una excepcion para Bolivia
      if (mosaicRegion==='211' || mosaicRegion==='205'){mosaicRegion='210'}
      var mosaics = paths.map( function(path) {
              
              var mosaic = ee.ImageCollection(path)
                .filter(ee.Filter.eq('region_code', Number(mosaicRegion)))
                .map(function(image) {
                  var index = ee.String(image.get('system:index')).slice(0, -3);
                  return image
                    .set('index', index);
                });
              
              if(mosaic.size().getInfo() !== 0) return mosaic;
              
            });
            
      mosaics = mosaics.filter( 
              function(m) { return m !== undefined }
            );
            
      var joinedMosaics = mosaics[0].merge(mosaics[1]);
      
      // var joinedMosaics = mosaics[0];
      
      // if(mosaics.length === 2) {
          
      //         var join = ee.Join.inner(),
      //             joiner = ee.Filter.equals({
      //               leftField: 'index',
      //               rightField: 'index'
      //             });
                  
      //         var joinedCollection = join.apply(mosaics[0], mosaics[1], joiner);
              
      //         joinedMosaics = ee.ImageCollection(
      //           joinedCollection.map( function(feature) {
      //             var primary = feature.get('primary'),
      //                 secondary = feature.get('secondary');
                      
      //             return ee.Image.cat(primary, secondary);
      //           })
      //         );
      //       }
            
      return joinedMosaics;
      
  };

  /**
 * Get new indexes
 * Get new index from images. Then compute
 * Urbans indexes .
 */
  this.newIndex = function(image, urbana_all_ref, threshold) {

      var uNTL = urbana_all_ref.gte(threshold)
      var ndvi = image.expression(
          'float(nir - red)/(nir + red)', {
              'nir': image.select('nir_median'),
              'red': image.select('red_median'),
          });

      var ndwi = image.expression(
          'float(swir1 - green)/(swir1 + green)', {
              'swir1': image.select('swir1_median'),
              'green': image.select('green_median'),
          });

      var ndbi = image.expression(
        'float(swir1 - nir)/(swir1 + nir)', {
          'nir': image.select('nir_median'),
          'swir1': image.select('swir1_median')
         });
      var nuaci = image.expression(
        'float(uNTL) * (1.0 - sqrt(pow((NDWI + 0.05), 2) + (pow((NDVI + 0.1), 2) + (pow((NDBI + 0.1), 2)))))', 
        {
          'uNTL': uNTL,
          'NDVI': ndvi,
          'NDBI': ndbi,
          'NDWI': ndwi
        }).multiply(100).add(100).byte().rename(["nuaci_median2"]);
     
     nuaci = ee.Image(1).where(nuaci, nuaci).rename(["nuaci_median2"]);


  return image.addBands(nuaci.select([0], ['nuaci_median2']));
    
};


  /**
 * Función para generar region de interés (ROI) con base en
 * las región de clasificación o una grilla millonésima contenida en ella
 */
  this._getRegion = function(regionPath, regionIds){
  
    var setVersion = function(item) { return item.set('version', 1) };
    
    var region = ee.FeatureCollection(regionPath)
                   .filter(ee.Filter.eq('id_regionC', regionIds));
    
    var regionMask = region
      .map(setVersion)
      .reduceToImage(['version'], ee.Reducer.first());
      
    return {
      vector: region,
      rasterMask: regionMask
    };
  
 };
  
  /**
   * RandomForests classifier
   */
  this.classifyRandomForests = function(mosaic, classifier, samples) {

    var bands = mosaic.bandNames();
    
    var nBands = bands.size();
    
    var points = samples.size();
    
    var nClassSamples = samples
      .reduceColumns(ee.Reducer.toList(), ['reference'])
      .get('list');
      
      
    nClassSamples = ee.List(nClassSamples)
      .reduce(ee.Reducer.countDistinct());
    
    
    var _classifier = ee.Classifier(
      ee.Algorithms.If(
        ee.Algorithms.IsEqual(nBands, 0),
        null, 
        ee.Algorithms.If(
          ee.Algorithms.IsEqual(nClassSamples, 1),
          null,
          classifier.train(samples, 'reference', bands)
        )
      )
    );

    var classified = ee.Image(
      ee.Algorithms.If(
        ee.Algorithms.IsEqual(points, 0),
        ee.Image().rename('classification'),
        ee.Algorithms.If(
          ee.Algorithms.IsEqual(nBands, 0),
          ee.Image().rename('classification'),
          ee.Algorithms.If(
            ee.Algorithms.IsEqual(nClassSamples, 1),
            ee.Image().rename('classification'),
            mosaic.classify(_classifier)
          )
        )
      )
    ).unmask(27).toByte();
    

    classified = classified
      .where(classified.neq(24), 27)
      .where(classified.eq(24), 24);

    
    return classified;
    
  };
  

  /**
   * utils methods
   */
  this.setVersion = function(item){ return item.set('version', 1) };
  
  
  
  this.removeProperty = function(feature, property) {
    var properties = feature.propertyNames();
    var selectProperties = properties.filter(ee.Filter.neq('item', property));
    return feature.select(selectProperties);
  };
  
  
  
  return this.init(param);
  
};


var Urban = new Urban(param);