var param = { 
    code_region: 70507,  //Region de Clasificacion 
    pais: 'PERU', 
    version_input: '1',
    yearView : 2000,
    paso: 'Original' //'Original','filtros'
}; 
 


// Obtiene la version de salida en base al ciclo
var version_input = param.version_input;
var prefixo_out = param.pais+ '-' + param.code_region + '-' + version_input
var dirinput 
if(param.paso == 'Original') {
     dirinput = 'projects/mapbiomas-raisg/TRANSVERSALES/'+param.pais+'/COLECCION5/URBANA/clasificacion'
  } else if(param.paso == 'filtros'){
     dirinput = 'projects/mapbiomas-raisg/TRANSVERSALES/'+param.pais+'/COLECCION5/URBANA/clasificacion-ft'
  }
print(dirinput);

var AssetMosaic='projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2'
var regionesclass = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-urban-5';

var mosaicRegion = param.code_region.toString().slice(0, 3);
var mosaic = ee.ImageCollection(AssetMosaic)
            .filterMetadata('region_code', 'equals', Number(mosaicRegion))
            .select(['swir1_median', 'nir_median', 'red_median'])
            .filterMetadata('year', 'equals', param.year);

////*************************************************************
// Do not Change from these lines
////*************************************************************
var regions = ee.FeatureCollection(regionesclass)
    .filterMetadata('id_regionC', "equals", param.code_region);
    
Map.addLayer(regions,{},'region',true)

var setVersion = function(item) { return item.set('version', 1) };
var regionRaster = regions
                      .map(setVersion)
                      .reduceToImage(['version'], ee.Reducer.first());
                      
var palettes = require('users/mapbiomas/modules:Palettes.js');

var Classificacion = ee.ImageCollection(dirinput).aside(print)
              .filter(ee.Filter.or(ee.Filter.eq('code_region', param.code_region), 
                                   ee.Filter.eq('region', param.code_region)))
              // .filterMetadata('code_region', 'equals', param.code_region)
              .filterMetadata('version', 'equals', version_input)
              // .filterMetadata('paso', 'equals', 'S04-2')
              .min();


print(Classificacion)
var vis = {
    'bands': 'classification_'+param.yearView,
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};
Map.addLayer(Classificacion, vis, 'classification_'+param.yearView,false);


  /**
 * Función para generar las estadísticas de cobertura por año y clase
 */
function getAreas(image, region) {

  var pixelArea = ee.Image.pixelArea();
  
  var reducer = {
    reducer: ee.Reducer.sum(),
    geometry: region.geometry(),
    scale: 30,
    maxPixels: 1e13
  };
  
  var bandNames = image.bandNames();
  
  var classIds = ee.List.sequence(0, 34);
  
  
  bandNames.evaluate( function(bands, error) {
    
    if(error) print(error.message);
    
    var yearsAreas = [];
  
  
    bands.forEach(function(band) {
    
      var year = ee.String(band).split('_').get(1),
          yearImage = image.select([band]);
  
      
      // Calcular áreas para cada clase cobertura
      var covers = classIds.map(function(classId) {
  
        classId = ee.Number(classId).int8();
      
        var yearCoverImage = yearImage.eq(classId),
            coverArea = yearCoverImage.multiply(pixelArea).divide(1e6);
        
        return coverArea.reduceRegion(reducer).get(band);
  
      }).add(year);
  
    
      // Generar la lista de keys para el diccionario
      var keys = classIds.map(function(item) {
  
        item = ee.Number(item).int8();
        
        var stringItem = ee.String(item);
        
        stringItem = ee.Algorithms.If(
          item.lt(10),
          ee.String('ID0').cat(stringItem),
          ee.String('ID').cat(stringItem)
        );
        
        return ee.String(stringItem);
        
      }).add('year');
  
      
      // Crear la lista de features para cada año, sin geometrías
      var dict = ee.Dictionary.fromLists(keys, covers);
  
      yearsAreas.push( ee.Feature(null, dict) );
      
    });
    
    
    yearsAreas = ee.FeatureCollection(yearsAreas);
  
    
    Export.table.toDrive({
      collection: yearsAreas,
      description: 'ESTADISTICAS-DE-COBERTURA-'+prefixo_out,
      fileFormat: 'CSV',
      folder: 'CLASSIFICATION-URBANA'
    });
      
  });
  }
  
getAreas(Classificacion, regions)
  
  