/** 
 *  Preintegracion Tema Transversal Urbano 
 * by: EYTC
 */
 
var param = {
    Tema: 'URBANA',
    ID_pais: 8,
    pais: 'PERU', //
    years: [2022],  // Lista de años Solo para visualizacion
    version_output:'2',
    source: 'Instituto del Bien Común (IBC)'
     }; 
     
/*
    PERU : 8
    GUIANA_FRANCESA: 9
    VENEZUELA : 1
    GUYANA : 2
    COLOMBIA: 3
    BRASIL: 4
    ECUADOR: 5
    SURINAME: 6
    BOLIVIA: 7
*/

// CODIGO DE REGION Y VERSION A INTEGRAR
var codesAndVersions = [
  // PERÚ
      [70101,	'16'],
      [70102,	'17'],
      [70103,	'16'],
      [70104,	'17'], //cambio
      [70201,	'16'],
      [70202,	'16'],
      [70203,	'16'],
      [70204,	'16'],
      [70205,	'16'],
      [70206,	'16'],
      [70207,	'16'],
      [70208,	'16'],
      [70301,	'16'],
      [70302,	'16'],
      [70303,	'16'],
      [70304,	'16'],
      [70305,	'16'],
      [70306,	'16'],
      [70307,	'16'],
];
        
        
// Assets
//---------------------------------
var palettes = require('users/mapbiomas/modules:Palettes.js');
var dirinput = 'projects/mapbiomas-raisg/TRANSVERSALES/'+param.pais+'/COLECCION5/URBANA/clasificacion-ft'
var diroutyYear =   'projects/mapbiomas-raisg/TRANSVERSALES/'+param.pais+'/COLECCION5/URBANA/INTEGRACION/urbana5'
var diroutAll =   'projects/mapbiomas-raisg/TRANSVERSALES/'+param.pais+'/COLECCION5/URBANA/INTEGRACION'
var assetCountries = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/paises-5';
var assetCountriesRaster = "projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/paises-5";
var regionesclass = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-urban-5';
var assetmosaics= 'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2'
var regionesclass = ee.FeatureCollection(regionesclass);
//---------------------------------

var collection = ee.ImageCollection(dirinput);

print(collection)
//
// convert vector to raster
//

function NamecountryCase (name){
          var paisLowerCase =''
          switch (name) {
            case "PERU":
                paisLowerCase = 'Perú';
                break;
            case "GUIANA_FRANCESA":
                paisLowerCase = 'Guiana Francesa';
                break;
            case "VENEZUELA":
                paisLowerCase = 'Venezuela';
                break;
            case "GUYANA":
                paisLowerCase = 'Guyana';
                break;
            case "COLOMBIA":
                paisLowerCase = 'Colombia';
                break;
            case "BRASIL":
                paisLowerCase = 'Brasil';
                break;
            case "ECUADOR":
                paisLowerCase = 'Ecuador';
                break;
            case "SURINAME":
                paisLowerCase = 'Suriname';
                break;
            case "BOLIVIA":
                paisLowerCase = 'Bolivia'
            }
  return paisLowerCase
}

var country = ee.FeatureCollection(assetCountries)
                .filterMetadata('name', 'equals', NamecountryCase(param.pais));
                  
Map.addLayer(country, {}, 'country', false)   

var countryraster = ee.Image(assetCountriesRaster).eq(param.ID_pais).selfMask()


var regionsRaster = ee.Image().uint32().paint({
                    featureCollection: regionesclass,
                    color: 'id_regionC'
                    }).rename(['regions']);

// var regionsRaster = ee.Image(regionesclassRaster)
var regionMosaicRaster = ee.Image().uint32().paint({
                    featureCollection: regionesclass,
                    color: 'id_region'
                    }).rename(['regions']);
                    
// var regionMosaicRaster = ee.Image(regionesMosaicRaster)
//
// Integrate
//

var collectionsByRegion = codesAndVersions
    .map(
        function (codeAndVersion) {
            var images = collection
                .filterMetadata('code_region', 'equals', codeAndVersion[0])
                .filterMetadata('version', 'equals', codeAndVersion[1])
                .map(
                    function (image) {
                        return image.mask(regionsRaster.eq(codeAndVersion[0]));
                    }
                );
            //print(codeAndVersion[0], codeAndVersion[1])
            return images.mosaic().byte();
        }
    );

var allRegionsClassification = ee.ImageCollection.fromImages(ee.List(collectionsByRegion));
var integracion_v0 = allRegionsClassification.mosaic()

var bandnamelist = integracion_v0.bandNames().getInfo();                            
print(bandnamelist) 
var integracion_v0_24 = ee.Image()
bandnamelist.forEach(function(bandname){
       var integracion_year = ee.Image(27).where(integracion_v0.select(bandname).eq(24), 24)
       integracion_v0_24 = integracion_v0_24.addBands(integracion_year.rename(bandname))
  })


integracion_v0_24 = integracion_v0_24.select(bandnamelist).toInt8().updateMask(countryraster)

var MosaicoCollection = ee.ImageCollection(assetmosaics)
    .filter(ee.Filter.inList('year',param.years))
    .select(['swir1_median', 'nir_median', 'red_median'])
    .map(
        function (image) {
            return image.updateMask(
                regionMosaicRaster.eq(ee.Number.parse(image.get('region_code')).toInt16()));
        }
    );

// Layer add

for (var yearI=0;yearI<param.years.length;yearI++) {
var vis = {
    'bands': 'classification_'+param.years[yearI],
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};

Map.addLayer(MosaicoCollection.filterMetadata('year', 'equals', param.years[yearI]),{
  "bands":["swir1_median","nir_median","red_median"],
  "min":407,"max":3381}, 'Mosaic' + param.years[yearI],false)
Map.addLayer(integracion_v0, vis, 'classification_'+param.years[yearI],false);
Map.addLayer(integracion_v0_24, vis, 'classification_export'+param.years[yearI],false);
}

//EXPORTA PAIS-AÑO-VERSIÓN
// - country (string) [para mapa general y para temas transversales] Ej: BOLIVIA
// - theme (string) [solo para temas transversales] Ej: WATER
// - year (number - integer) Ej: 2010
// - version (string) - use números en formato de string. Debe ser la misma versión que está en el nombre del asset Ej: 1
// - collection (number - float). Ejemplo: 3.0
// - source (string) - Ejemplo: imazon, solved, Instituto del Bien Común (IBC), Fundacion Ecociencia...

for(var year=1985; year<=2022;year++){
  var prefixo_out = param.pais + '-' + year + '-' + param.version_output
  var integracionyear = integracion_v0_24.select('classification_'+year)
                          .rename('classification')
                          .set('country', param.pais)
                          .set('theme', 'URBAN')
                          .set('year', year)
                          .set('version', param.version_output)
                          .set('collection', '5.0')
                          .set('source', param.source);
    print(year, integracionyear);
    
    Export.image.toAsset({
        'image':integracionyear,
        'description': prefixo_out,
        'assetId': diroutyYear+'/' +prefixo_out,
        'pyramidingPolicy': {
            '.default': 'mode'
        },
        'region': country.geometry().bounds(),
        'scale': 30,
        'maxPixels': 1e13
    });
}

//EXPORTAR TODO EN UNA SOLA IMAGEN, PAIS-VERSIÓN

  var prefixo_out = param.pais + '-' + 'URBAN' + '-' + param.version_output
  var integracionUrban = integracion_v0_24
                          .set('country', param.pais)
                          .set('theme', 'URBAN')
                          .set('version', param.version_output)
                          .set('collection', '5.0')
                          .set('source', param.source);
    print(integracionUrban);
    
    Export.image.toAsset({
        'image':integracionUrban,
        'description': prefixo_out,
        'assetId': diroutAll+'/' +prefixo_out,
        'pyramidingPolicy': {
            '.default': 'mode'
        },
        'region': country.geometry().bounds(),
        'scale': 30,
        'maxPixels': 1e13
    });

