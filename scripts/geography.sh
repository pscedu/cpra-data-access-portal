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

# Generate vector tiles.
echo "Generating vector tiles..."
tippecanoe -zg -o $TILES/geography-vector.mbtiles \
		--force \
		--coalesce-densest-as-needed \
		--extend-zooms-if-still-dropping \
		--base-zoom=7 \
		-n "Geography: Vector" \
		$WORKING/extraction_point.geojson \
		$WORKING/hydro_compartment.geojson \
		$WORKING/ecoregion.geojson \
		$WORKING/clara.geojson
