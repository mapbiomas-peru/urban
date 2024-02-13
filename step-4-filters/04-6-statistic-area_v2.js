var param = { 
    code_region: 70103,  //Region de Clasificacion 
    pais: 'PERU', 
    version_input: '15',
    yearView : 2000,
    paso: 'filtros' //'Original','filtros'
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



// Numeric attribute to index the shapefile
var attribute = "id_arp";

// A list of class ids you are interested
var classIds = [
    27,
    24, // Infraestrutura Urbana

];

// Output csv name
var outputName = 'areas';

// Change the scale if you need.
var scale = 30;

// Define a list of years to export
var years = [
    '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992',
    '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000',
    '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008',
    '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016',
    '2017', '2018', '2019', '2020', '2021', '2022'
];

// Define a Google Drive output folder 
var driverFolder = 'AREA-EXPORT';

/**
 * 
 */
// Territory
var territory = regions;

// LULC mapbiomas image
var mapbiomas = Classificacion.selfMask();

// Image area in km2
var pixelArea = ee.Image.pixelArea().divide(1000000);

// Geometry to export
var geometry = mapbiomas.geometry();

/**
 * Convert a complex ob to feature collection
 * @param obj 
 */
var convert2table = function (obj) {

    obj = ee.Dictionary(obj);

    var territory = obj.get('territory');

    var classesAndAreas = ee.List(obj.get('groups'));

    var tableRows = classesAndAreas.map(
        function (classAndArea) {
            classAndArea = ee.Dictionary(classAndArea);

            var classId = classAndArea.get('class');
            var area = classAndArea.get('sum');

            var tableColumns = ee.Feature(null)
                .set(attribute, territory)
                .set('class', classId)
                .set('area', area);

            return tableColumns;
        }
    );

    return ee.FeatureCollection(ee.List(tableRows));
};

/**
 * Calculate area crossing a cover map (deforestation, mapbiomas)
 * and a region map (states, biomes, municipalites)
 * @param image 
 * @param territory 
 * @param geometry
 */
var calculateArea = function (image, territory, geometry) {

    var reducer = ee.Reducer.sum().group(1, 'class').group(1, 'territory');

    var territotiesData = pixelArea.addBands(territory).addBands(image)
        .reduceRegion({
            reducer: reducer,
            geometry: geometry,
            scale: scale,
            maxPixels: 1e12
        });

    territotiesData = ee.List(territotiesData.get('groups'));

    var areas = territotiesData.map(convert2table);

    areas = ee.FeatureCollection(areas).flatten();

    return areas;
};

var areas = years.map(
    function (year) {
        var image = mapbiomas.select('classification_' + year);

        var areas = territory.map(
            function (feature) {
                return calculateArea(
                    image.remap(classIds, classIds, 0),
                    ee.Image().int64().paint({
                        'featureCollection': ee.FeatureCollection(feature),
                        'color': attribute
                    }),
                    feature.geometry()
                );
            }
        );

        areas = areas.flatten();

        // set additional properties
        areas = areas.map(
            function (feature) {
                return feature.set('year', year);
            }
        );

        return areas;
    }
);

areas = ee.FeatureCollection(areas).flatten();

Map.addLayer(territory);

Export.table.toDrive({
    collection: areas,
    description: outputName +  '-' + param.code_region +  '-' + param.version_input,
    folder: driverFolder,
    fileNamePrefix: outputName +  '-' + param.code_region +  '-' + param.version_input,
    fileFormat: 'CSV'
});


