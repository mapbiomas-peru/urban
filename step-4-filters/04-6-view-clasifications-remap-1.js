/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var inclusion = /* color: #3614d6 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-76.3237420310458, -6.473597994969973],
                  [-76.32460027565135, -6.471721832052054],
                  [-76.32717516878479, -6.468694227028139],
                  [-76.32837676102088, -6.469077979381582],
                  [-76.32631677053199, -6.475303635276085]]]),
            {
              "value": 1,
              "type": "inclusion",
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-73.32032475811675, -13.652950550678197],
                  [-73.32028184169488, -13.65572374516713],
                  [-73.32058225018217, -13.658663750996105],
                  [-73.31950936657621, -13.65887225933853],
                  [-73.31925187451078, -13.653242469378053]]]),
            {
              "value": 1,
              "type": "inclusion",
              "system:index": "1"
            })]),
    exclusion = /* color: #ff0000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-76.3634815709856, -6.488607687549568],
                  [-76.36124997308521, -6.485196440535515],
                  [-76.36794476678638, -6.487243191515146]]]),
            {
              "value": 1,
              "type": "exclusion",
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-73.33864961010649, -13.664001506492948],
                  [-73.33624635082914, -13.66387640423178],
                  [-73.33727631909086, -13.660665423471263],
                  [-73.34083829266265, -13.661624552175944]]]),
            {
              "value": 1,
              "type": "exclusion",
              "system:index": "1"
            })]),
    from_27_to_24_2020_2022 = /* color: #f7ff25 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([-71.97315717137369, -13.511807202310383]),
            {
              "original": "27,",
              "new": "24,",
              "t0": 2020,
              "t1": 2022,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-71.97420861228322, -13.513726679404314],
                  [-71.97384381257746, -13.513371979839913],
                  [-71.9728996573871, -13.511619393041764],
                  [-71.97414423441275, -13.513184211795446]]]),
            {
              "original": "27,",
              "new": "24,",
              "t0": 2020,
              "t1": 2022,
              "system:index": "1"
            })]),
    from_24_to_27_2020_2022 = /* color: #ff17f3 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([-71.94805169499429, -13.517753300390012]),
            {
              "original": "24,",
              "new": "27,",
              "t0": 2020,
              "t1": 2022,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-71.94764399922403, -13.517935853685954],
                  [-71.94781029818539, -13.517810675215859],
                  [-71.9487383405021, -13.517544667880575],
                  [-71.94827163613351, -13.51800887496517],
                  [-71.94782639106573, -13.518154919567925],
                  [-71.94769764340433, -13.518034953988051]]]),
            {
              "original": "24,",
              "new": "27,",
              "t0": 2020,
              "t1": 2022,
              "system:index": "1"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/

// SCRIPT PARA REVISAR CLASIFICACIONES Y CREAR GEOMETRIAS DE INCLUSION Y EXCLUSION
// REMAP de clasificaciones
// Sep 2023

var param = {
  region: 70306,
  country: 'PERU',
  versionClassification: '15',   // version de clasificacion
  versionClassification_out: '16',   // version de clasificacion
  no_piramide: false,
  remapGeometry: [from_27_to_24_2020_2022, from_24_to_27_2020_2022],
  classificationArea : {   // Para Incluir o exluir el Area de clasificacion con el Buffer 
        versionClassArea: '1',   // Area de clasificacion con el Buffer
        inclusion: inclusion,
        exclusion: exclusion,
        versionClassAreaOutput: '2'
  },
  version_export_geometry: '1',
  exportassets: {
    classificationRemap : true,
    classificationArea: false,
    geometries : false
  }
};

var Urban = function(param){
  
  this.param = param;
  
  this.inputs = {
    mosaics: [
            'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2',
            'projects/mapbiomas-raisg/MOSAICOS/mosaics-2'
    ],
    _regions : 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-urban-5',
    _clasificacionArea: 'projects/mapbiomas-raisg/MUESTRAS/'+param.country+'/COLECCION4/TRANSVERSALES/URBANA/STEP1_REGIONS/URBANA-REF-ACCUM-'+param.country+ '-'+ param.region +'-' + param.classificationArea.versionClassArea,
    samples: 'projects/mapbiomas-raisg/MUESTRAS/'+param.country+'/COLECCION5/TRANSVERSALES/URBANA/',
    result: 'projects/mapbiomas-raisg/TRANSVERSALES/'+param.country+'/COLECCION5/URBANA/clasificacion-ft',
    urbana_all_ref: 'projects/mapbiomas-raisg/MOSAICOS/Urbana_all_ref_v2',
    years: [
      1985, 1986, 1987, 1988, 
      1989, 1990, 1991, 1992, 
      1993, 1994, 1995, 1996, 
      1997, 1998, 1999, 2000, 
      2001, 2002, 2003, 2004, 
      2005, 2006, 2007, 2008, 
      2009, 2010, 2011, 2012, 
      2013, 2014, 2015, 2016, 
      2017, 2018, 2019, 2020,
      2021, 2022
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

    var assetclassArea = _this.inputs._clasificacionArea;
    var urbana_all_ref = _this.inputs.urbana_all_ref;

    var trees = param.trees;
    var _print = param._print;
    var version = param.versionClassification.toString();
    var palette = _this.inputs.palette;
    
    var samplesPath = _this.inputs.samples;
    var assetMosaics = _this.inputs.mosaics;
    var years = _this.inputs.years;
    var outputPathClasif = _this.inputs.result;
    
    
    // Region
    var region = _this._getRegion(regionAsset, regionId);
    var regionMask = region.rasterMask;
    var regionLayer = region.vector;
      // print(regionLayer)
    Map.addLayer(regionLayer,{},'regionLayer',true)
    
    // Mosaics
    // var mosaic = this.getMosaic( assetMosaics, regionId);
    var mosaicRegion = regionId.toString().slice(0, 3);
    var mosaic =ee.ImageCollection(assetMosaics[0]).merge(ee.ImageCollection(assetMosaics[1]))
                  .filter(ee.Filter.eq('region_code',Number(mosaicRegion)))
                  // .select(['swir1_median', 'nir_median', 'red_median'])
    // print(mosaic)
    
    var GeometriesIE = ee.FeatureCollection([param.classificationArea.inclusion, param.classificationArea.exclusion]).flatten()
    // print(GeometriesIE)
    
    var classArea = ee.Image(assetclassArea).updateMask(regionMask)
        classArea = _this.inclus_exclu(classArea, param.classificationArea.inclusion, param.classificationArea.exclusion);

    // Classification
    var classified = ee.ImageCollection(outputPathClasif)
                                                        .filter(ee.Filter.eq('code_region',regionId ))
                                                        .filter(ee.Filter.eq('version',version ))
                                                        .mosaic()
                                                      //  .updateMask(classArea);
    var classifiedMax = classified.eq(24).reduce('max').multiply(24);
    
    // Exclusión de clases en areas delimitadas con geometrías
    var classified_remap = _this.remapWithPolygons(classified, param.remapGeometry).updateMask(classArea);
    // print('classified_remap',classified_remap)
    
    // Terrain
    var dem = ee.Image('JAXA/ALOS/AW3D30_V1_1').select("AVE");  
    var slope = ee.Terrain.slope(dem).rename('slope');
    var slppost = ee.Image('projects/mapbiomas-raisg/MOSAICOS/slppost2_30_v1').rename('slppost')
    var shadeMask2 = ee.Image("projects/mapbiomas-raisg/MOSAICOS/shademask2_v1").rename('shade_mask2')
    var water = ee.Image("JRC/GSW1_2/GlobalSurfaceWater")
              .select('occurrence')
              .gte(1)
    
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
       

      Map.addLayer(yearMosaic, {
          bands: ['swir1_median', 'nir_median', 'red_median'],
          gain: [0.08, 0.06, 0.2]
        }, 
        'MOSAICO ' + year, 
        false
      );
      
      var name = 'classification_' + year.toString();
      
        var classifiedYear  = classified.select(name)
        var classified_remapYear  = classified_remap.select(name)
      if(param.no_piramide){
        classifiedYear  = classifiedYear.select(name).reproject('EPSG:4326', null, 30);
        classified_remapYear  = classified_remapYear.reproject('EPSG:4326', null, 30);
      }

      Map.addLayer(classifiedYear, {
          min: 0, 
          max: 34,
          palette: _this.inputs.palette
        }, 
        'CLASIFICACION ' + year, 
        false
      );
      
      Map.addLayer(classified_remapYear, {
          min: 0, 
          max: 34,
          palette: _this.inputs.palette
        }, 
        'CLASIFICACION-REMAP-' + year, 
        false
      );
      
    });
      Map.addLayer(classifiedMax, {
          min: 0, 
          max: 34,
          palette: _this.inputs.palette
        }, 
        'CLASIFICACION MAX ACUMULADO', 
        false
      );
    Map.addLayer(water,
      {
        palette: '0e00ff'
      },'GlobalSurfaceWater',false
      );
    Map.addLayer(classArea,
      {
        palette: 'fcff00'
      },'classArea',false
      );
    // Export  to asset
    if(param.exportassets.classificationArea){
      Export.image.toAsset({
        image: classArea,
        description:'URBANA-'+ 'REF-ACCUM' + '-'+ country + '-'+ regionId + '-'+ param.classificationArea.versionClassAreaOutput,
        assetId:'projects/mapbiomas-raisg/MUESTRAS/'+country+'/COLECCION5/TRANSVERSALES/URBANA/STEP1_REGIONS/'+ 'URBANA-'+ 'REF-ACCUM' + '-'+ country + '-'+ regionId + '-'+ param.classificationArea.versionClassAreaOutput,
        scale: 30,
        pyramidingPolicy: {
          '.default': 'mode'
        },
        maxPixels: 1e13,
        region: regionLayer.geometry().bounds()
      });
    }

  if(param.exportassets.classificationRemap){
    classified_remap = classified_remap
          .set('code_region', regionId)
          .set('pais', country)
          .set('version', param.versionClassification_out)
          .set('descripcion', 'remap')

    // print('export:',classified_remap)
    var prefixo_out = country + '-' + regionId + '-'    
    // EXPORTS 
      Export.image.toAsset({
          'image': classified_remap,
          'description': prefixo_out+param.versionClassification_out,
          'assetId': outputPathClasif+'/' +prefixo_out+param.versionClassification_out,
          'pyramidingPolicy': {
              '.default': 'mode'
          },
          'region': regionLayer.geometry().bounds(),
          'scale': 30,
          'maxPixels': 1e13
      });
   }
    
    var fileName = 'urban' + '-' + regionId  + '-' + country  + '-' + param.version_export_geometry;
    var assetId = 'projects/mapbiomas-raisg/MUESTRAS/'+country+'/COLECCION5/TRANSVERSALES/URBANA/STEP3_GEOMETRY/' + fileName;
    
    if(param.exportassets.geometries){
      Export.table.toAsset(GeometriesIE, fileName, assetId);
    }
    
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
      if (regionId===21101 || regionId===21102){mosaicRegion='210'}
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
      
      var joinedMosaics = mosaics[0];
      
      if(mosaics.length === 2) {
          
              var join = ee.Join.inner(),
                  joiner = ee.Filter.equals({
                    leftField: 'index',
                    rightField: 'index'
                  });
                  
              var joinedCollection = join.apply(mosaics[0], mosaics[1], joiner);
              
              joinedMosaics = ee.ImageCollection(
                joinedCollection.map( function(feature) {
                  var primary = feature.get('primary'),
                      secondary = feature.get('secondary');
                      
                  return ee.Image.cat(primary, secondary);
                })
              );
            }
            
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
  
  
  /**
 * Función para remapear, de manera interactiva, zonas delimitadas por polígonos
 * Estos polígonos se dibujan con las herramientas de dibujo de GEE y se indica el año o los años a aplicar
 * y se definen como ee.FeatureCollection()
 */
  this.remapWithPolygons =  function(image_classif, polygons) {
      
      if(polygons.length > 0) {  
        polygons.forEach(function( polygon ) {
          
          var excluded = polygon.map(function( layer ){
            
            var area = image_classif.clip(layer);
            var from = ee.String(layer.get('original')).split(',');
            var to = ee.String(layer.get('new')).split(',');
            
            var t0 = ee.Number.parse(layer.get('t0'));
            var t1 = ee.Number.parse(layer.get('t1'));
            var yearsSel = ee.List.sequence(t0,t1,1)
    
            from = from.map( function( item ){
              return ee.Number.parse( item );
            });
            to = to.map(function(item){
              return ee.Number.parse( item );
            });
            
            var remapRY = area;
    
            var imageOperation = function(year, previousImage) {
              var remapYear = area.select(ee.String('classification_').cat(ee.Number(year).toInt16()))
                                  .remap(from, to)
                                  .rename(ee.String('classification_').cat(ee.Number(year).toInt16()));
              
              return ee.Image(previousImage).addBands(remapYear, null, true);
            };
            
            remapRY = ee.Image(yearsSel.iterate(imageOperation, remapRY));
            
            return remapRY;
          });
          print('excluded',excluded);
          excluded = ee.ImageCollection( excluded ).mosaic();
          // Map.addLayer(excluded);
          
          image_classif = excluded.unmask( image_classif );
          // image_classif = image_classif.mask( image_classif.neq(27) );
        });
      } else image_classif = image_classif;
      
  return image_classif;
  
}
  
  
  
  return this.init(param);
  
};


var Urban = new Urban(param);
