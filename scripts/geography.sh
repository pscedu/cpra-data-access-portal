#!/bin/bash

DATA="./data"
TILES="./tiles"
WORKING="./working"

export GDAL_CACHEMAX="80%"
export GDAL_NUM_THREADS="ALL_CPUS"

mkdir -p "$WORKING"
mkdir -p "$TILES"

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

read -r -d '' block_group_sql << SQL
select cast(GEOID10 as int) as id,
	GEOID10 as name,
	geom
from block_group
where STATEFP10 = '22' or COUNTYFP10 in ('045', '047', '059')
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$block_group_sql" \
		$WORKING/block_group.geojson \
		$WORKING/geography.gpkg \
		-nln block_group

read -r -d '' block_group_label_sql << SQL
select id as label,
  st_pointonsurface(st_collect(geom)) as geom
from ($block_group_sql) as src
group by id
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$block_group_label_sql" \
		$WORKING/block_group_label.geojson \
		$WORKING/geography.gpkg \
		-nln block_group_label \

read -r -d '' extraction_point_sql << SQL
select extraction_point.site_no as id,
	hydro_compartment.ICM_ID as hydro_compartment_id,
	ecoregion.er_n as ecoregion_id,
	extraction_point.geom
from extraction_point
left join hydro_compartment
	on st_intersects(extraction_point.geom, hydro_compartment.geom)
left join ecoregion
	on st_intersects(extraction_point.geom, ecoregion.geom)
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$extraction_point_sql" \
		$WORKING/extraction_point.geojson \
		$WORKING/geography.gpkg \
		-nln extraction_point

read -r -d '' hydro_compartment_sql << SQL
select hydro_compartment.ICM_ID as id,
	ecoregion.er_n as ecoregion_id,
	hydro_compartment.geom
from hydro_compartment
left join ecoregion
	on st_intersects(st_pointonsurface(hydro_compartment.geom), ecoregion.geom)
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$hydro_compartment_sql" \
		$WORKING/hydro_compartment.geojson \
		$WORKING/geography.gpkg \
		-nln hydro_compartment \
		-dim XY

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

read -r -d '' ecoregion_sql << SQL
select ecoregion.er_n as id,
	ecoregion.ecoregion as code,
	ecoregion.name,
	ecoregion.geom
from ecoregion
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$ecoregion_sql" \
		$WORKING/ecoregion.geojson \
		$WORKING/geography.gpkg \
		-nln ecoregion

read -r -d '' ecoregion_label_sql << SQL
select code as label,
  st_pointonsurface(st_collect(geom)) as geom
from ($ecoregion_sql) as src
group by code
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$ecoregion_label_sql" \
		$WORKING/ecoregion_label.geojson \
		$WORKING/geography.gpkg \
		-nln ecoregion_label

read -r -d '' clara_sql << SQL
select clara.MP_Community_ID as id,
	clara.MP_Community_Code as code,
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

read -r -d '' clara_label_sql << SQL
select id as label,
  st_pointonsurface(st_collect(geom)) as geom
from ($clara_sql) as src
group by id
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$clara_label_sql" \
		$WORKING/clara_label.geojson \
		$WORKING/geography.gpkg \
		-nln clara_label \

# Generate vector tiles.
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
		$WORKING/clara_label.geojson
