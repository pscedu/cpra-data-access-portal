#!/bin/bash

DATA="./data"
TILES="./tiles"
WORKING="./working"

export GDAL_CACHEMAX="80%"
export GDAL_NUM_THREADS="ALL_CPUS"

rm -f $DATA/model-geometries.gpkg
ogr2ogr -t_srs "EPSG:26915" \
    $DATA/model-geometries.gpkg \
		/vsizip/$DATA/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_QAQC_sites.shp.zip/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_QAQC_sites.shp \
		-nln "extraction_point"

ogr2ogr -append -t_srs "EPSG:26915" \
	$DATA/model-geometries.gpkg \
	/vsizip/$DATA/tl_2010_22_bg10.zip/tl_2010_22_bg10.shp \
	-nln "block_group" \
	-nlt MultiPolygon

ogr2ogr -append -t_srs "EPSG:26915" \
	$DATA/model-geometries.gpkg \
	/vsizip/$DATA/tl_2010_28_bg10.zip/tl_2010_28_bg10.shp \
	-where "COUNTYFP10 in ('045', '047', '059')" \
	-nln "block_group" \
	-nlt MultiPolygon

ogr2ogr -append -t_srs "EPSG:26915" \
    $DATA/model-geometries.gpkg \
		/vsizip/$DATA/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_H_comps.shp.zip/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_H_comps.shp \
    -dialect sqlite \
    -sql "select ST_MakeValid(geometry) as geometry, * from MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_H_comps" \
		-nln "hydro_compartment" \
		-nlt MultiPolygon

ogr2ogr -append -t_srs "EPSG:26915" \
    $DATA/model-geometries.gpkg \
		/vsizip/$DATA/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_ecoregions.shp.zip/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_ecoregions.shp \
		-nln "ecoregion" \
		-nlt MultiPolygon

ogr2ogr -append -t_srs "EPSG:26915" \
    $DATA/model-geometries.gpkg \
		$DATA/Community_Splits_20220823.gdb \
    -dialect sqlite \
    -sql "select ST_MakeValid(shape) as geometry, * from MP2023_Communities_CLARA_split_20220823_FINAL_ID" \
		-nln "clara_community"

ogr2ogr -append -t_srs "EPSG:26915" \
	$DATA/model-geometries.gpkg \
	/vsizip/$DATA/tl_2021_us_county.zip/tl_2021_us_county.shp \
	-where "STATEFP = '22'" \
	-nln parish \
	-nlt MultiPolygon

rm -Rf $DATA/model-geometries.gdb
ogr2ogr -f "OpenFileGDB" -overwrite \
	$DATA/model-geometries.gdb \
	$DATA/model-geometries.gpkg \
	extraction_point \
	-mapFieldType "Integer64=Integer"

ogr2ogr -f "OpenFileGDB" -append \
	$DATA/model-geometries.gdb \
	$DATA/model-geometries.gpkg \
	block_group \
	hydro_compartment \
	ecoregion \
	clara_community \
	parish \
	-nlt MultiPolygon \
	-mapFieldType "Integer64=Real"

rm -f $DATA/model-geometries.gdb.zip
(cd $DATA && zip -r model-geometries.gdb.zip model-geometries.gdb)
