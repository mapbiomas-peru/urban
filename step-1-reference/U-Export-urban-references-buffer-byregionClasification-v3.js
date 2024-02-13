// COMPARACION DE REFERENCIAS Y ACUMULADO URBANA
// 
 
var param = {
       pais:  'PERU',
       ID_pais: 8,
       region : 70304,
       BUFFER: 300,
       referenciaAcc : 
          [ // Selecionar  Referencias para acumular
            "Ref1_stable_pixel_of_urban_Col4",
            "Ref2_accumulated_of_urban_Col4",
            "Ref3_ESRI_Built_Area",
            "Ref4_ESA_WorldCover_project_2020_Built_up",
            "Ref5_World Settlement Footprint 2015",
            "Ref6_World Settlement Footprint 2019",
            "Ref7_World Settlement Footprint Evolution 1985-2015",
            "Ref8_Mapa_densidad_población_alta_resolución_CIESIN_Facebook",
            "Ref9_Global_land_cover_and_land_use_2019"
          ],
        filtroEspacial:{ //OPCIONAL
          usar: false,
          pixelsAgrupadosMin: 20,  //pixeles agrupados
          },
        bufferProporcionalArea:{ //OPCIONAL
          usar: false,   // si es FALSE se usará para todos BUFFER
          threshold: 1000, // numero de pixeles acumulado urbano
          lowerbuffer: 60
        },
        version : 1,
        exportdrive: false,
        tilescale : 4
  }

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

var assetCountries = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/paises-4';
var assetCountriesRaster = "projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/paises-4";
var assetRegionClasVector = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-urban-5';

var setVersion = function(item) { return item.set('version', 1) }
var SelRegion = ee.FeatureCollection(assetRegionClasVector)
                  .filter(ee.Filter.eq('id_regionC', param.region))
print(SelRegion)
Map.addLayer(SelRegion, {},'region clasificacion')

var regionMask = SelRegion
      .map(setVersion)
      .reduceToImage(['version'], ee.Reducer.first());

var palette = require('users/mapbiomas/modules:Palettes.js').get('classification6');
var vis = { min: 0, max: 49, palette: palette };

var a = require('users/bzgeo/examples:_ancillary/afr_asia');
// ESA
var esa_lc = ee.ImageCollection("ESA/WorldCover/v100");
// ESRI
var esri_lc = ee.ImageCollection("projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m");

// Ref3-World Settlement Footprint 2015 2019 1985-2015
var wsf2015 = ee.ImageCollection("projects/sat-io/open-datasets/WSF/WSF_2015"),
    wsf2019 = ee.ImageCollection("projects/sat-io/open-datasets/WSF/WSF_2019"),
    wsf_evo = ee.ImageCollection("projects/sat-io/open-datasets/WSF/WSF_EVO");
    
//Ref4-Mapa de densidad de población de alta resolución (CIESIN) - Facebook
var HRSL = ee.ImageCollection("projects/sat-io/open-datasets/hrsl/hrslpop");

// Homologado
var esa_lc_MB = esa_lc.first().eq(50).multiply(24).selfMask()
var esri_lc_MB = esri_lc.mosaic().eq(7).multiply(24).selfMask()

// Ref5-Global land cover and land use 2019, v1.0
var GLCmap2019map = ee.ImageCollection('projects/glad/GLCmap2019').mosaic();

// Ref6-stable and accumulated of urban Col3
var stables = ee.Image('projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/stables-3')
                .eq(24).multiply(24).selfMask();

var integration = ee.Image('projects/mapbiomas-raisg/public/collection4/mapbiomas_raisg_panamazonia_collection4_integration_v1');

var Per_col1 = ee.Image('projects/mapbiomas-public/assets/peru/collection1/mapbiomas_peru_collection1_integration_v1')
  
integration = integration.blend(Per_col1)

var urban = integration.eq(24)
var acumulado = urban.reduce('max').multiply(24).selfMask()

// //
// var dict1 = { // ESA WorldCover
// "names": ['Tree cover','Shrubland','Grassland','Cropland','Built-up','Bare / sparse vegetation','Snow and ice',
// 'Open water','Herbaceous wetland','Mangroves','Moss and lichen'],
// "colors": ['006400','ffbb22','ffff4c','f096ff','fa0000','b4b4b4','f0f0f0','0064c8','0096a0','00cf75','fae6a0']};
// //"colors": ['#358221','ffbb22','ffff4c','f096ff',"#ED022A",'b4b4b4','f0f0f0','#1A5BAB','0096a0','00cf75','fae6a0']};

// var dict2 = { // Esri Land Cover
// "names": ["Water","Trees","Grass","Flooded Vegetation","Crops","Scrub/Shrub","Built Area","Bare Ground","Snow/Ice","Clouds"],
// "colors": ["#1A5BAB","#358221","#A7D282","#87D19E","#FFDB5C","#EECFA8","#ED022A","#EDE9E4","#F2FAFF","#C8C8C8"]};


// //
// Map.addLayer(esri_lc.mosaic(), {min:1, max:10, palette:dict2['colors'],opacity:1}, 'ESRI LULC 10m');
// Map.addLayer(esa_lc.first(), {}, 'ESA_WC_LC_2020');

//Ref5-Global land cover and land use 2019, v1.0
var visParamMap = {min:0,max:255,palette:['FEFECC','FDFDC8','FCFCC4','FAFAC0','F9F9BC','F7F7B8','F6F6B4','F4F4B0','F2F2AC','F1F1A8','EFEFA4',
'EEEEA1','ECEC9D','EBEB99','E9E995','E8E891','E6E68D','E5E589','E3E385','E2E281','E0E07D','DFDF7A','DDDD76','DBDB72','DADA6E','D8D86A','D5D564',
'D4D460','D2D25C','D1D158','CFCF54','CDCD50','CCCC4D','CACA49','C9C945','C7C741','C6C63D','C4C439','C3C335','C1C131','C0C02D','BEBE29','BDBD26',
'BBBB22','BABA1E','B8B81A','B6B616','B5B512','B3B30E','B2B20A','B0B006','609C60','5E9A5E','5C985C','5A965A','589458','569256','549054','528E52',
'508C50','4E8A4E','4C884C','4A864A','488448','468246','448044','427E42','407C40','3E7A3E','3C783C','3A763A','387438','367236','347034','326E32',
'316D31','2F6C2F','2C6A2C','296829','276627','246524','216321','1E611E','1B5E1B','175B17','145A14','115811','0E560E','0B540B','095309','065106',
'033303','FFABFF','FFA5FF','FF9EFF','FF98FF','FF91FF','FF8AFF','FF83FF','FF7DFF','FF76FF','FF6FFF','FF68FF','FF62FF','FF5AFF','FF53FF','FF4CFF',
'FF45FF','FF3EFF','FF38FF','FF31FF','FF2AFF','FF23FF','FF1CFF','FF16FF','FF0FFF','FF0000','000000','000000','000000','BFC0C0','BCBFC0','B8BEC2',
'B4BCC3','B1BBC4','ADBAC5','A9B9C6','A6B8C7','A2B7C9','9EB6CA','9AB5CB','97B4CC','93B2CD','90B2CE','8DB0CF','89AFD0','85AED1','82ADD3','7EACD4',
'7AABD5','77AAD6','73A9D7','70A8D8','6CA7D9','68A5DA','64A3DC','60A2DD','5CA0DE','589FDF','559EE0','519DE1','4E9CE2','4A9BE3','469AE4','4399E6',
'3F98E7','3B97E8','3895E9','3494EA','3193EB','2E92EC','2A91ED','2690EE','238FF0','1F8EF1','1C8DF2','188CF3','148BF4','118AF5','0D88F6','0986F7',
'9DC7C7','99C5C5','95C3C3','90C1C1','8CBFBF','87BDBD','83BBBB','7FB9B9','7AB7B7','76B5B5','72B3B3','6DB1B1','67AEAE','62ABAB','5EA9A9','5AA7A7',
'55A5A5','51A3A3','4DA1A1','489F9F','449D9D','3F9B9B','3A9999','369797','327C7C','327A7B','31787A','317678','307477','2F7275','2F7074','2F6E73',
'2C6A6F','2B696E','2B676D','2B656C','2A636A','296169','295F67','285D66','275B65','8C7BF0','8B77EF','8B74EF','8A71EE','8A6DEE','896AED','8967ED',
'8864EC','8861EC','875DEB','875AEB','8657EA','8351E7','834EE7','824BE6','8248E6','8144E5','8141E5','803EE4','803BE4','7F38E3','7F34E3','7E31E2',
'7D2EE1','C80000','000000','000000','000000','00F4F4','00E8E8','00DDDD','00D0D0','00C5C5','00B7B7','00ACAC','009F9F','009494','008888','00007D',
'FFFFFF','FF7D00','000000','000032','010101']};
// Map.addLayer(map,visParamMap,'Global land cover and land use');
Map.addLayer(GLCmap2019map.updateMask(GLCmap2019map.gt(240).and(GLCmap2019map.lte(249))),visParamMap,'Ref9_Global_land_cover_and_land_use_2019', false);

var HRSLimage=HRSL.median()
var palettes = require('users/gena/packages:palettes')
var rgbVis = {palette: palettes.colorbrewer.Reds[9]}
Map.addLayer(HRSLimage,rgbVis,'Ref8_Mapa_densidad_población_alta_resolución_CIESIN_Facebook', false)

var wfs_evo_palette = ['#1a9850', '#66bd63', '#a6d96a', '#d9ef8b', '#ffffbf', '#fee08b', '#fdae61', '#f46d43', '#d73027']
Map.addLayer(wsf_evo.mosaic(),{'min':1985,'max':2015,'palette':wfs_evo_palette},'Ref7_World Settlement Footprint Evolution 1985-2015', false)

Map.addLayer(wsf2019.mosaic(),{'min':255,'max':255},'Ref6_World Settlement Footprint 2019', false)

Map.addLayer(wsf2015.mosaic(),{'min':255,'max':255},'Ref5_World Settlement Footprint 2015', false)

Map.addLayer(esa_lc_MB, vis, 'Ref4_ESA_WorldCover_project_2020_Built_up', false);

Map.addLayer(esri_lc_MB, vis, 'Ref3_ESRI_Built_Area', false);

// Ref6-stable and accumulated of urban Col3
  Map.addLayer(
    acumulado,
    vis,
    'Ref2_accumulated_of_urban_Col4', false
  );
    Map.addLayer(
    stables,
    vis,
    'Ref1_stable_pixel_of_urban_Col4', false
    );
  
var ref_stables = ee.Image(0).where(stables.selfMask(), 1).rename('Ref1_stable_pixel_of_urban_Col4')
var ref_acumulado  = ee.Image(0).where(acumulado.selfMask(), 1).rename('Ref2_accumulated_of_urban_Col4')
var ref_esri_lc_MB  = ee.Image(0).where(esri_lc_MB.selfMask(), 1).rename('Ref3_ESRI_Built_Area')
var ref_esa_lc_MB  = ee.Image(0).where(esa_lc_MB.selfMask(), 1).rename('Ref4_ESA_WorldCover_project_2020_Built_up')
var ref_wsf2015  = ee.Image(0).where(wsf2015.mosaic().selfMask(), 1).rename('Ref5_World Settlement Footprint 2015')
var ref_wsf2019  = ee.Image(0).where(wsf2019.mosaic().selfMask(), 1).rename('Ref6_World Settlement Footprint 2019')
var ref_wsf_evo  = ee.Image(0).where(wsf_evo.mosaic().selfMask(), 1).rename('Ref7_World Settlement Footprint Evolution 1985-2015')
var ref_HRSLimage  = ee.Image(0).where(HRSLimage.selfMask(), 1).rename('Ref8_Mapa_densidad_población_alta_resolución_CIESIN_Facebook')
var ref_GLCmap2019map  = ee.Image(0).where(GLCmap2019map.updateMask(GLCmap2019map.gt(240).and(GLCmap2019map.lte(249))).selfMask(), 1).rename('Ref9_Global_land_cover_and_land_use_2019')




var ACUMULADO_TOTAL = ee.Image(0).addBands(ref_stables)
                                 .addBands(ref_acumulado)
                                 .addBands(ref_esri_lc_MB)
                                 .addBands(ref_esa_lc_MB)
                                 .addBands(ref_wsf2019)
                                 .addBands(ref_wsf2015)
                                 .addBands(ref_HRSLimage)
                                 .addBands(ref_GLCmap2019map)
                                 .addBands(ref_wsf_evo)
                                 .updateMask(regionMask);
                                 
Map.addLayer(ACUMULADO_TOTAL,{},'ACUMULADO_TOTAL',false)
print(ACUMULADO_TOTAL.bandNames())
var ACUMULADO_TOTAL_sel = ACUMULADO_TOTAL.select(param.referenciaAcc).reduce('sum').selfMask();

// var ACUMULADO_TOTAL = ee.Image(0).where(stables.selfMask(), 24)
//                                 .where(acumulado.selfMask(), 24)
//                                 .where(map.updateMask(map.gte(240).and(map.lte(249))).selfMask(), 24)
//                                 .where(image.selfMask(), 24)
//                                 .where(wsf_evo.mosaic().selfMask(), 24)
//                                 .where(wsf2019.mosaic().selfMask(), 24)
//                                 .where(wsf2015.mosaic().selfMask(), 24)
//                                 .where(esri_lc_MB.selfMask(), 24)
//                                 .where(esa_lc_MB.selfMask(), 24)
//                                 .selfMask()

    

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
                  
// Map.addLayer(country, {}, 'country', false);

var countryraster = ee.Image(assetCountriesRaster).eq(param.ID_pais).selfMask()

Map.addLayer(
    ACUMULADO_TOTAL_sel.updateMask(regionMask),//.reproject('EPSG:4326', null, 30),
    {min:0, max:param.referenciaAcc.length,palette:['fff829','ffce45','ff920a','ff6e19','ff0000','b30000']},
    'ACUMULADO TOTAL_Sel', true
  );
  
var image_export = ACUMULADO_TOTAL_sel.gte(1).updateMask(regionMask).toUint8()

image_export= image_export.reproject('EPSG:4326', null, 30)
var conect = image_export.connectedPixelCount(1000).rename('connected')
  
if(param.filtroEspacial.usar){
  // var valuePix = param.filtroEspacial.pixelsAgrupadosMin*100
  // print('valuePix:',valuePix)

  Map.addLayer(conect,{"bands":["connected"],"min":1,"max":100 ,"palette":["b90000","ff0000","ffbf10","f2ff1b","23ff47","10c9ff"]},'conect',false)
  print(conect.projection().nominalScale())
  image_export = image_export.mask(conect.select('connected').gte(param.filtroEspacial.pixelsAgrupadosMin))

 }
 
if(param.bufferProporcionalArea.usar === false){
  var ACUMULADO_TOTAL_sel_BUFFER = ee.Image(1)
    .cumulativeCost({
      source: image_export, 
      maxDistance: param.BUFFER,
    }).lt(param.BUFFER);
    ACUMULADO_TOTAL_sel_BUFFER = ee.Image(0).where(ACUMULADO_TOTAL_sel_BUFFER.eq(1), 1).selfMask().updateMask(regionMask)

Map.addLayer(ACUMULADO_TOTAL_sel_BUFFER,{},'ACUMULADO_TOTAL_sel_BUFFER',false)
}
if(param.bufferProporcionalArea.usar){
  var image_export1 = image_export.mask(conect.select('connected').gte(param.bufferProporcionalArea.threshold)).selfMask()
  var ACUMULADO_TOTAL_sel_BUFFER1 = ee.Image(1)
    .cumulativeCost({
      source: image_export1, 
      maxDistance: param.BUFFER,
    }).lt(param.BUFFER);
    ACUMULADO_TOTAL_sel_BUFFER1 = ee.Image(0).where(ACUMULADO_TOTAL_sel_BUFFER1.eq(1), 1).selfMask()
    
  var image_export2 = image_export.mask(conect.select('connected').lt(param.bufferProporcionalArea.threshold)).selfMask()
  var ACUMULADO_TOTAL_sel_BUFFER2 = ee.Image(1)
    .cumulativeCost({
      source: image_export2, 
      maxDistance: param.bufferProporcionalArea.lowerbuffer,
    }).lt(param.bufferProporcionalArea.lowerbuffer);
    ACUMULADO_TOTAL_sel_BUFFER2 = ee.Image(0).where(ACUMULADO_TOTAL_sel_BUFFER2.eq(1), 1).selfMask()
    
  var ACUMULADO_TOTAL_sel_BUFFER = ee.Image(0).where(ACUMULADO_TOTAL_sel_BUFFER1, 1)
                                              .where(ACUMULADO_TOTAL_sel_BUFFER2, 1)
                                              .updateMask(regionMask)
                                              .selfMask()
  
  Map.addLayer(ACUMULADO_TOTAL_sel_BUFFER,{},'ACUMULADO_TOTAL_sel_BUFFER prop')
  
  
  // var Areas_G = [100 , 200 , 300 , 400 , 500 , 600 , 700 , 800 , 900 , 1000]  //PIXEL
  
  // // reclas
  // var GPCReclas = ee.Image(0).updateMask(countryraster)
  // Areas_G.forEach(function(Zmax){
  //   GPCReclas = GPCReclas.where(conect.lte(Zmax)
  //                       .and(conect.gte((Zmax-250))), ee.Number(Zmax).round().toUint16()).selfMask()
  // })
  
  
  // Map.addLayer(GPCReclas,{"palette":["b90000","ff0000","ffbf10","f2ff1b","23ff47","10c9ff"]},'Area_Reclas')
 }

if(param.exportdrive){
//Export the image, specifying scale and region.
Export.image.toDrive({
  image: ACUMULADO_TOTAL_sel_BUFFER,
  description: 'ACUMULADO_AREAS_URBANAS_sel'+'-' + param.pais + '-'+ param.version,
  scale: 30,
  maxPixels: 1e13,
  folder:'EXPORT-MAPBIOMAS',
  region: country.geometry().bounds(),
  shardSize:1024
});
}

Export.image.toAsset({
  image: ACUMULADO_TOTAL_sel_BUFFER,
  description:'URBANA-'+ 'REF-ACCUM' + '-'+ param.pais + '-'+ param.region + '-'+ param.version,
  assetId:'projects/mapbiomas-raisg/MUESTRAS/'+param.pais+'/COLECCION5/TRANSVERSALES/URBANA/STEP1_REGIONS/'+ 'URBANA-'+ 'REF-ACCUM' + '-'+ param.pais + '-'+ param.region + '-'+ param.version,
  scale: 30,
  pyramidingPolicy: {
    '.default': 'mode'
  },
  maxPixels: 1e13,
  region: country.geometry().bounds()
});
  
