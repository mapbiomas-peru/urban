var listregion = [
    // //ANDES
          [70301,'1'],
          [70302,'1'],
          [70303,'1'],
          [70304,'1'],
          [70305,'1'],
          [70306,'1'],
          [70307,'1'],
          [70401,'1'],
          [70402,'1'],
          [70403,'1'],
          [70404,'1'],
          [70405,'1'],
]

for (var ireg = 0; ireg<listregion.length; ireg ++) {
  var param = {
      code_region: listregion[ireg][0],
      pais: 'PERU',
      year_view: [2021,2022],  // Solo visualizacion  
      version_input: '1', //COLECCION 5             1
      version_output: '41', // COLECCION 5           11
      List_year_add: [2022], // Año a agregar de COLECCION 5
     }
    print(param.code_region)
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
              // .select(['swir1_median', 'nir_median', 'red_median']);
              
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
  // print(Clasificacion)
  
  
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
  * Layers
  */
  var colleccion5_ajus = ee.Image([]).select([])
  var years = [
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
    ]
var list_nuaci_th = ee.List.sequence(155, 141, -0.1,38).getInfo(); 
  
  years.forEach(function(year) {
  
        // Mosaics
        var yearMosaic = collect_mosaic.filter(ee.Filter.eq('year', year))
                                      .median()
                                      .updateMask(regionRaster);
                                      
        var urban2022 = colleccion5.select('classification_2022').eq(24).selfMask()
        
        yearMosaic = newIndex(yearMosaic, urban2022, 1)  
        
        var colleccion5_2 = colleccion5.select('classification_'+year).where(yearMosaic.select('nuaci_median2').gte(list_nuaci_th[year -1985]), 24)
         colleccion5_ajus = colleccion5_ajus.addBands(colleccion5_2)

         
      var vis = {
          'bands': ['classification_' + year],
          'min': 0,
          'max': 34,
          'palette': palettes.get('classification2'),
          'format': 'png'
       };
  
  
      Map.addLayer(
        yearMosaic,
        {
          bands: ['swir1_median', 'nir_median', 'red_median'],
          gain: [0.08, 0.06, 0.2]
        },
        'MOSAICO ' + year.toString(), false
      );
      
      Map.addLayer(
        yearMosaic.select('nuaci_median2').updateMask(urban2022),
        {
         min: 120, max: 180,
         palette: ["45ff08","fff70a","ffb50e","ff5504","ff0000"],
        },
        'nuaci_median2 ' + year.toString(), false
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
        
        Map.addLayer(
              colleccion5_2,
              vis,
              'clasificacion col5-ajus' + year, false)
        
     });
  
  
  
  /**
  * Export images to asset
  */
  var imageName = param.pais + '-' + param.code_region + '-' + param.version_output;
  
  colleccion5_ajus = colleccion5_ajus.toByte()
                    .set('code_region', param.code_region)
                    .set('pais', param.pais)
                    .set('version', param.version_output)
                    .set('descripcion', 'join')
                    .set('paso', 'S04-0')
                    
  // print(colleccion5_ajus);
  
  Export.image.toAsset({
      'image': colleccion5_ajus,
      'description': imageName,
      'assetId':  OutputAsset + '/'+ imageName,
      'pyramidingPolicy': {
          '.default': 'mode'
      },
      'region': regions.geometry().bounds(),
      'scale': 30,
      'maxPixels': 1e13
  });



}







  /**
 * Get new indexes
 * Get new index from images. Then compute
 * Urbans indexes .
 */
function newIndex(image, urbana_all_ref, threshold) {

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
    
}

