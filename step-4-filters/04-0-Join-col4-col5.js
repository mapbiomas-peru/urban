var param = {
    code_region: 70405,
    pais: 'PERU',
    year_view: [2021,2022],  // Solo visualizacion  
    version_input: '14', //COLECCION 5             1
    version_output: '15', // COLECCION 5           11
    List_year_add: [2021, 2022], // Año a agregar de COLECCION 5
   }
  
// input
var AssetUrbanClass = 'projects/mapbiomas-raisg/TRANSVERSALES/'+param.pais+'/COLECCION5/URBANA/clasificacion'
var OutputAsset = 'projects/mapbiomas-raisg/TRANSVERSALES/'+param.pais+'/COLECCION5/URBANA/clasificacion-ft'
var assetcoleccion4= 'projects/mapbiomas-raisg/public/collection4/mapbiomas_raisg_panamazonia_collection4_integration_v1'
var assetcol1_Pe = 'projects/mapbiomas-public/assets/peru/collection1/mapbiomas_peru_collection1_integration_v1'

var AssetMosaic='projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2'
var AssetMosaic2='projects/mapbiomas-raisg/MOSAICOS/mosaics-2'

var AssetRegions = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-urban-4';
// var AssetRegionsRaster = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-3';
 
var palettes = require('users/mapbiomas/modules:Palettes.js');
var eePalettes = require('users/gena/packages:palettes');


var regions = ee.FeatureCollection(AssetRegions)
                .filterMetadata('id_regionC', "equals", param.code_region);
var mosaicRegion = param.code_region.toString().slice(0, 3);
// var regionRaster = ee.Image(AssetRegionsRaster).eq(param.code_region).selfMask()
if (mosaicRegion=='211' || mosaicRegion=='205'){mosaicRegion='210'}
var setVersion = function(item) { return item.set('version', 1) };
var regionRaster = regions
                      .map(setVersion)
                      .reduceToImage(['version'], ee.Reducer.first());
                      
                      
var collect_mosaic = ee.ImageCollection(AssetMosaic).merge(ee.ImageCollection(AssetMosaic2))
            .filterMetadata('region_code', 'equals', Number(mosaicRegion))
            .select(['swir1_median', 'nir_median', 'red_median']);
            
var collection4 = ee.Image(assetcoleccion4)
var col1_Pe = ee.Image(assetcol1_Pe)

collection4 = collection4.blend(col1_Pe)
// print(collection4)

collection4 = collection4.where(collection4.eq(24),24)
                         .where(collection4.neq(24),27) 
                         .updateMask(regionRaster)
var Clasificacion;
if(param.version_input < 10) {
   Clasificacion = ee.ImageCollection(AssetUrbanClass)
                      .filterMetadata('region', 'equals', param.code_region)
                      .filterMetadata('version', 'equals', param.version_input)
                      .filterMetadata('metodo', 'equals', 'Random forest')
                      .mosaic()
} else {
   Clasificacion = ee.ImageCollection(OutputAsset)
                      .filterMetadata('code_region', 'equals', param.code_region)
                      .filterMetadata('version', 'equals', param.version_input)
                      .mosaic()
}
print(Clasificacion)


// get band names list 
  var bandNamesAdd = ee.List(
      param.List_year_add.map(
          function (year) {
              return 'classification_' + String(year);
          }
      )
  );

var colleccion5 = collection4.addBands(Clasificacion.select(bandNamesAdd), null, true).updateMask(regionRaster)

/**
* Export images to asset
*/
var imageName = param.pais + '-' + param.code_region + '-' + param.version_output;

colleccion5 = colleccion5
                  .set('code_region', param.code_region)
                  .set('pais', param.pais)
                  .set('version', param.version_output)
                  .set('descripcion', 'gapfill')
                  .set('paso', 'S04-1')
                  
print(colleccion5);

Export.image.toAsset({
    'image': colleccion5,
    'description': imageName,
    'assetId':  OutputAsset + '/'+ imageName,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': regions.geometry().bounds(),
    'scale': 30,
    'maxPixels': 1e13
});

/**
* Layers
*/

  param.year_view.forEach(function(year) {
  
    var vis = {
        'bands': ['classification_' + year],
        'min': 0,
        'max': 34,
        'palette': palettes.get('classification2'),
        'format': 'png'
     };

    var mosaicYear = collect_mosaic.filterMetadata('year', 'equals', year)
      .mosaic()
      .clip(regions);
      
    Map.addLayer(
      mosaicYear,
      {
        bands: ['swir1_median', 'nir_median', 'red_median'],
        gain: [0.08, 0.06, 0.2]
      },
      'MOSAICO ' + year.toString(), false
    );
    
    if (year < 2022) {
      Map.addLayer(
      collection4,
      vis,
      'clasificacion col4- ' + year, false)
    }
    
      Map.addLayer(
      colleccion5,
      vis,
      'clasificacion col5-' + year, false)

   });

