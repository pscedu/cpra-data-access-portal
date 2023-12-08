#!/bin/bash

DATA="./data"
TILES="./tiles"
WORKING="./working"

export GDAL_CACHEMAX="80%"
export GDAL_NUM_THREADS="ALL_CPUS"

mkdir -p "$WORKING"
mkdir -p "$TILES"

# Geography GeoPackage
ogr2ogr -t_srs "EPSG:26915" \
    $WORKING/geography.gpkg \
		/vsizip/$DATA/tl_2010_22_bg10.zip/tl_2010_22_bg10.shp \
		-nln "block_group" \
		-nlt MultiPolygon

ogr2ogr -append -t_srs "EPSG:26915" \
    $WORKING/geography.gpkg \
		/vsizip/$DATA/tl_2010_28_bg10.zip/tl_2010_28_bg10.shp \
		-nln "block_group" \
		-nlt MultiPolygon

ogr2ogr -append -t_srs "EPSG:26915" \
    $WORKING/geography.gpkg \
		/vsizip/$DATA/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_QAQC_sites.shp.zip/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_QAQC_sites.shp \
		-nln "extraction_point"

ogr2ogr -append -t_srs "EPSG:26915" \
    $WORKING/geography.gpkg \
		/vsizip/$DATA/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_H_comps.shp.zip/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_H_comps.shp \
		-nln "hydro_compartment" \
		-nlt MultiPolygon

ogr2ogr -append -t_srs "EPSG:26915" \
    $WORKING/geography.gpkg \
		/vsizip/$DATA/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_ecoregions.shp.zip/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_ecoregions.shp \
		-nln "ecoregion" \
		-nlt MultiPolygon

ogr2ogr -append -t_srs "EPSG:26915" \
    $WORKING/geography.gpkg \
		$DATA/Community_Splits_20220823.gdb \
		-nln "clara" \
		"MP2023_Communities_CLARA_split_20220823_FINAL_ID"

ogr2ogr -append \
		$WORKING/geography.gpkg \
		$DATA/community_splits_names.csv \
		-nln "clara_name"

# Block groups
read -r -d '' block_group_sql << SQL
select cast(GEOID10 as int) as id,
	geom
from block_group
where STATEFP10 = '22' or COUNTYFP10 in ('045', '047', '059')
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$block_group_sql" \
		$WORKING/block_group.geojson \
		$WORKING/geography.gpkg \
		-nln block_group

# Block group labels
read -r -d '' block_group_label_sql << SQL
select id as label,
  st_pointonsurface(st_collect(geom)) as geom
from ($block_group_sql) as src
group by id
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$block_group_label_sql" \
		$WORKING/block_group_label.geojson \
		$WORKING/geography.gpkg \
		-nln block_group_label

# Extraction points 
read -r -d '' extraction_point_sql << SQL
select extraction_point.qaqc_filet as id,
	extraction_point.geom
from extraction_point
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$extraction_point_sql" \
		$WORKING/extraction_point.geojson \
		$WORKING/geography.gpkg \
		-nln extraction_point

# Hydro compartments
read -r -d '' hydro_compartment_sql << SQL
select hydro_compartment.ICM_ID as id,
	hydro_compartment.geom
from hydro_compartment
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$hydro_compartment_sql" \
		$WORKING/hydro_compartment.geojson \
		$WORKING/geography.gpkg \
		-nln hydro_compartment \
		-dim XY

# Hydro compartment labels
read -r -d '' hydro_compartment_label_sql << SQL
select id as label,
  st_pointonsurface(st_collect(geom)) as geom
from ($hydro_compartment_sql) as src
group by id
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$hydro_compartment_label_sql" \
		$WORKING/hydro_compartment_label.geojson \
		$WORKING/geography.gpkg \
		-nln hydro_compartment_label \
		-dim XY

# Ecoregions
read -r -d '' ecoregion_sql << SQL
select ecoregion.ecoregion as id,
	ecoregion.name,
	ecoregion.geom
from ecoregion
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$ecoregion_sql" \
		$WORKING/ecoregion.geojson \
		$WORKING/geography.gpkg \
		-nln ecoregion

# Ecoregion labels
read -r -d '' ecoregion_label_sql << SQL
select name as label,
  st_pointonsurface(st_collect(geom)) as geom
from ($ecoregion_sql) as src
group by name
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$ecoregion_label_sql" \
		$WORKING/ecoregion_label.geojson \
		$WORKING/geography.gpkg \
		-nln ecoregion_label

# CLARA communities
read -r -d '' clara_sql << SQL
select clara.MP_Community_ID as id,
	clara_name.display_name as name,
	clara.Shape as geom
from clara
left join clara_name
	on clara.MP_Community_ID = clara_name.community_id
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$clara_sql" \
		$WORKING/clara.geojson \
		$WORKING/geography.gpkg \
		-nln clara

# CLARA community labels
read -r -d '' clara_label_sql << SQL
select name as label,
  st_pointonsurface(st_collect(geom)) as geom
from ($clara_sql) as src
group by id
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$clara_label_sql" \
		$WORKING/clara_label.geojson \
		$WORKING/geography.gpkg \
		-nln clara_label

# Parishes
read -r -d '' parish_sql << SQL
select cast(GEOID as int) as id,
	NAME as name,
	geometry as geom
from tl_2021_us_county
where STATEFP = '22'
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$parish_sql" \
    $WORKING/parish.geojson \
    /vsizip/$DATA/tl_2021_us_county.zip/tl_2021_us_county.shp \
		-nln parish

# Parish labels
read -r -d '' parish_label_sql << SQL
select name as label,
  st_pointonsurface(st_collect(geom)) as geom
from ($parish_sql) as src
group by name
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$parish_label_sql" \
		$WORKING/parish_label.geojson \
		/vsizip/$DATA/tl_2021_us_county.zip/tl_2021_us_county.shp \
		-nln parish_label

# Vector tiles
echo "Generating vector tiles..."
tippecanoe -zg -o $TILES/geography-vector.mbtiles \
		--force \
		--coalesce-densest-as-needed \
		--extend-zooms-if-still-dropping \
		--base-zoom=7 \
		-n "Geography: Vector" \
		$WORKING/extraction_point.geojson \
		$WORKING/block_group.geojson \
		$WORKING/block_group_label.geojson \
		$WORKING/hydro_compartment.geojson \
		$WORKING/hydro_compartment_label.geojson \
		$WORKING/ecoregion.geojson \
		$WORKING/ecoregion_label.geojson \
		$WORKING/clara.geojson \
		$WORKING/clara_label.geojson \
		$WORKING/parish.geojson \
		$WORKING/parish_label.geojson
