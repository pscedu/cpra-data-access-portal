# Master Plan Data Access Portal Documentation

This is the documentation for the [2023 Louisiana Coastal Master Plan Data Access Portal (MP-DAP)](https://mpdap.coastal.la.gov). For questions or comments, please e-mail [masterplan@la.gov](mailto:masterplan@la.gov). This page was last updated July 19, 2023.

The 2023 Coastal Master Plan is Louisiana's roadmap for adapting to this uncertain environment. It guides investment in restoration and risk-reduction projects that will allow future generations to continue to call the coast home.

But how do we plan for an uncertain future? While we don’t know exactly what the future may bring, the master plan uses the best available science to help make informed decisions using planning scenarios. A scenario is a plausible version of the future based on our knowledge of climate drivers like temperature, sea level rise, and storm intensity. Scenarios are not predictions, but possibilities for what the future coast might look like based on the best available science.

The 2023 Coastal Master Plan uses two scenarios to guide its recommendations: a lower scenario, and a higher scenario. In the lower, more moderate scenario, the Gulf of Mexico would rise by one-point-six feet over the next fifty years. In the higher, more severe scenario, sea levels rise by two and a half feet, storms are stronger, and the risks are greater. These scenarios are startling, but it’s important to keep in mind that they are not forecasts. Rather, they are tools that help the state effectively allocate resources to prepare for the future.

Projects selected for the 2023 Coastal Master Plan were chosen because they provide significant benefits under both the lower and higher scenarios. This approach allows the state to make high-confidence decisions on how to invest with no regrets, no matter what the future may bring.

## Reference Documents

All technical appendices for the 2023 Master Plan are available on the [Master Plan website](https://coastal.la.gov/our-plan/2023-coastal-master-plan/). Documentation pertaining to the models used for the master plan development process, including the production of all data available in the MP-DAP are summarized in:

- [APPENDIX C: USE OF PREDICTIVE MODELS IN THE 2023 COASTAL MASTER PLAN and its attachments](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#C)
- [APPENDIX D: OVERVIEW OF IMPROVEMENTS TO LANDSCAPE MODELING (ICM) FOR 2023 and its attachments](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#D)

## Metadata

All geospatial data available in the MP-DAP uses the [EPSG:26915 (NAD83/UTM zone 15N) projection](https://epsg.io/26915). All elevation data is provided relative to the NAVD88 Geoid 12B vertical datum.

### Model Geometries: ICM-Hydro grid

This polygon shapefile maps the ICM-Hydro compartments and includes a descriptor of how each compartment is utilized in ICM-Hydro. 2D compartments are the primary wetland area within coastal LA where the all ICM subroutines are activated (Hydro, Veg, Morph, HSI). Upland compartments are included for water balance purposes and are delineated following NHD boundaries to ensure smooth transitions with inland modeling exercises being undertaken by the Louisiana Watershed Initiative.

- **Units:** n/a
- **Spatial resolution:** varied
- **Temporal resolution:** n/a

### Model Geometries: ICM-LAVegMod grid

This is the 480-m orthogonal grid that is used by ICM-LAVegMod and ICM-HSI subroutines. For each 480-m grid cell, ICM-LAVegMod calculates the percent coverage of each of the 46 landtypes/vegetation coverages that are tracked by the model.

- **Units:** n/a
- **Spatial resolution:** 480-m grid
- **Temporal resolution:** n/a

### Model Geometries: ADCIRC grid

This is the mesh used by ADCIRC to model the existing conditions landscape, including levees on the landscape as of 2018.

- **Units:** n/a
- **Spatial resolution:** varied
- **Temporal resolution:** n/a

### Model Geometries: CLARA grid

This is the mesh used to assess flood depth and economic damages with the CLARA model.

- **Units:** n/a
- **Spatial resolution:** varied
- **Temporal resolution:** n/a

### Model Geometries: Ecoregions

Ecoregions are used to summarize model output for the 2023 Coastal Master Plan. Ecoregions were defined first by coastal basin, but then further refined by hydrologic pathways and other prominent landscape features (either natural or manmade). Ecoregions were further split into barrier island subregions if the ICM-BIDEM model domain overlapped with the original ecoregion. The ecoregions used for the 2023 Master Plan are aggregrated groups of ICM-Hydro compartments.

- **Units:** n/a
- **Spatial resolution:** varied
- **Temporal resolution:** n/a

### Model Geometries: CLARA communities

The Risk Assessment Team aggregates EADD and EASD results at the master plan community level. The team identified 204 communities using parish or municipal boundaries that were further categorized based on the community’s location either inside or outside of existing structural protection, resulting in 374 distinct geographic areas.

- **Units:** n/a
- **Spatial resolution:** varied
- **Temporal resolution:** n/a

### Model Geometries: QAQC Extraction points

Prior to starting simulations for the 2023 Coastal Master Plan, a number of locations were identified as "model save points". These points are locations at which all model data, down to a specific pixel, is saved in order to conduct quality assurance and quality control (QAQC) on model processes and simulations. There are three categories of QAQC extraction points: CRMS locations – every observation station within the Coastwide Reference Monitoring System (CRMS) was selected as a save point; Transects – several transects were deliberately placed at a variety of locations around the coastal domain; and randomly placed QAQC points.

- **Units:** n/a
- **Spatial resolution:** n/a
- **Temporal resolution:** n/a

### Initial Conditions - land/water

Landscape composition developed from satellite imagery collected in 2018, this represents the initial conditions used for the 2023 master plan development process. Full documentation provided in 2023 Coastal Master Plan: [Attachment B3](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#B). The raster values representing landscape composition are defined as follows: 1=vegetated wetland; 2=open water; 3=unvegetated wetland/bare ground; 4=developed/upland; 5=flotant marsh.

- **Units:** categorical
- **Spatial resolution:** 30-m raster
- **Temporal resolution:** n/a

### Initial Conditions - vegetation cover LULC

Landscape composition developed from satellite imagery collected in 2018, this represents the vegetation coverage of the initial conditions used for the 2023 master plan development process. Satellite imagery was classified to the predominant vegetation species included in ICM-LAVegMod. Full documentation provided in 2023 Coastal Master Plan: [Attachment B3](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#B).

- **Units:** categorical
- **Spatial resolution:** 10-m raster
- **Temporal resolution:** n/a

### Initial Conditions - FFIBS

Landscape composition developed from satellite imagery collected in 2018, this represents the vegetation coverage of the initial conditions used for the 2023 master plan development process, that is then reclassified into a weighted FFIBS score for each of the ICM-LAVegMod 480-m grid cells. Documentation for the vegetation classification is provided in 2023 Coastal Master Plan: [Attachment B3](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#B). Documentation on the weighted FFIBS score methodology is provided in 2023 Coastal Master Plan: [Attachment C8](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#C) and [Attachment D2](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#D). FFIBS scores range from 0 to 24 for areas that are vegetated wetland. All other (non-vegetated wetland) areas use the following classifications: 200=open water; 300=unvegetated wetland/bare ground; 400=developed/upland; 500=flotant marsh.

- **Units:** weighted FFIBS score
- **Spatial resolution:** 30-m raster
- **Temporal resolution:** n/a

### Marsh Edge Erosion

This is a raster of historic marsh edge erosion rates (in m/yr) that were quantified from high resolution aerial imagery for all marsh edge areas with at least 300-m of omnidirectional fetch. The historic rates are used, in conjunction with the number of elapsed model years to determine whether any given edge pixel would be eroded during a given model year. For full documentation on this dataset, please refer to [Attachment B1](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#B).

- **Units:** m/yr
- **Spatial resolution:** 30-m raster
- **Temporal resolution:** n/a

### Deep Subsidence

The deep subsidence rates (mm/yr; positive indicates downward movement) were developed for use as a boundary condition in the 2023 Coastal Master Plan. The interpolated surface was developed from CORS observational GPS stations located throughout Coastal Lousiana - with supplmental observation points from the CRMS benchmark surveys. Refer to full documentation in [Attachment B3](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#B). In the master plan models, these deep subsidence rates are combined with variable (both in space and potentially across assumed scenarios) shallow subsidence rates that were derived from CRMS measurements. Furthermore, both the deep and shallow subsidence rates have all vertical accretion rates removed; the ICM dynamically models vertical accretion as a function of both mineral sediment deposition and organic matter accumulation in the vegetated areas. Therefore, for a total elevation change rate, four different datasets must be combined by the model: deep subsidence (downward movement), shallow subsidence (downward movement), mineral deposition (upward movement), and organic accretion (upward movement).This raster represents deep subsidence rates in coastal regions of Louisiana.

- **Units:** mm/yr
- **Spatial resolution:** 30-m raster
- **Temporal resolution:** n/a

### Shallow Subsidence

The shallow subsidence rates (mm/yr; positive indicates downward movement) were developed for use as a boundary condition in the 2023 Coastal Master Plan. These rates were derived from the Coastwide Reference Monitoring System (CRMS) surface elevation and vertical accretion datasets. These rates are highly spatially variable, and were therefore averaged for each ecoregion used in the 2023 Master Plan. Descriptive statistics of shallow subsidence rates for each ecoregion are provided in this tabular file. A shapefile of the ecoregions is provided for download via the "Model Grids" dataset. Subsidence rates were assigned to each ecoregion as defined by the future environmnetal scenarios (Appendix B). Refer to full documentation in [Appendix B and Attachment B3](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#B). In the master plan models, these shallow subsidence rates are combined with deep subsidence rates that were derived from GPS data. Furthermore, both the deep and shallow subsidence rates have all vertical accretion rates removed; the ICM dynamically models vertical accretion as a function of both mineral sediment deposition and organic matter accumulation in the vegetated areas. Therefore, for a total elevation change rate, four different datasets must be combined by the model: deep subsidence (downward movement), shallow subsidence (downward movement), mineral deposition (upward movement), and organic accretion (upward movement).This raster represents deep subsidence rates in coastal regions of Louisiana.

- **Units:** mm/yr
- **Spatial resolution:** Ecoregion
- **Temporal resolution:** n/a

### Projects

This is a geodatabase package that includes the spatial extent of all projects included in the 2023 Master Plan.

- **Units:** n/a
- **Spatial resolution:** Project
- **Temporal resolution:** Annual (implementation year)

### Land Change

This is a raster that shows how the landscape composition has changed from initial conditions. If the land change is under a Future Without Action (FWOA), the raster values will be two digits. The first digit represents the landscape under initial conditions, and the second digit represents the landscape at the current year. For example, if the FWOA land change at year 10 has a value of 12, this indicates that the pixel started as land (1) in initial conditions and was converted to water (2) by year 10. If the land change is under a Future With Master Plan (FWMP), the raster values will be three digits. The first two digits will be identical to the FWOA land change, and the third digit will represent the landscape under FWMP. For example, if the FWMP land change at year 10 has a value of 121, this indicates that the pixel started as land (1) in initial conditions and was converted to water (2) by year 10 under FWOA; however, with the implementation of the Master Plan, this pixel was kept as land at year 10 under FWMP. The values of each digit representing landscape composition are defined as follows: 1=vegetated wetland; 2=open water; 3=unvegetated wetland/bare ground; 4=developed/upland; 5=flotant marsh.

- **Units:** categorical
- **Spatial resolution:** 30-m raster
- **Temporal resolution:** Annual (decadal in the MPDV)

### Vegetation Type/FFIBS

The vegetation data can be viewed in one of two different ways; the first is to use the marsh classification, which uses a weighted score to classify the vegetation as Fresh Forested, Fresh Marsh, Intermediate Marsh, Brackish Marsh, or Saline Marsh, or FFIBS. For more information on the weighted FFIBS score methodology, see [Attachment C8](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#C). FFIBS scores range from 0 to 24 for areas that are vegetated wetland. All other (non-vegetated wetland) areas use the following classifications: 200=open water; 300=unvegetated wetland/bare ground; 400=developed/upland; 500=flotant marsh. The second method is to summarize the mixture of vegetation species present into one of 15 vegetation community types, or VCT. For more information on which species are commonly associated with each VCT, see: Snedden, G.A., 2019. Patterning emergent marsh vegetation assemblages in coastal Louisiana, USA, with unsupervised artificial neural networks. Applied Vegetation Science. 22: 213-229. DOI: 10.1111.avsc.12425.

- **Units:** weighted FFIBS score
- **Spatial resolution:** 30-m raster
- **Temporal resolution:** Annual (decadal in the MPDV)

### Vegetation Type/VCT

The vegetation data can be viewed in one of two different ways; the first is to use the marsh classification, which uses a weighted score to classify the vegetation as Fresh Forested, Fresh Marsh, Intermediate Marsh, Brackish Marsh, or Saline Marsh, or FFIBS. For m ore information on the weighted FFIBS score methodology, see [Attachment C8](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#C). The second method is to summarize the mixture of vegetation species present into one of 15 vegetation community types, or VCT. For more information on which species are commonly associated with each VCT, see: Snedden, G.A., 2019. Patterning emergent marsh vegetation assemblages in coastal Louisiana, USA, with unsupervised artificial neural networks. Applied Vegetation Science. 22: 213-229. DOI: 10.1111.avsc.12425.

- **Units:** categorical
- **Spatial resolution:** 30-m raster
- **Temporal resolution:** Annual (decadal in the MPDV)

### Flood Depth

This dataset is the flood depth estimates (in feet), reported out at individual annual exceedance probabilities. To estimate flooding potential, our analysis considers storms of different intensity and tracks, and their expected probability of occurring in any one year. The flood depths resulting from those storms change over time as the coast degrades and sea level rise increases water levels. This dataset reports out the flood depth with a given likelihood of occurring in any given year, with a defined "annual exceedance probability". This is a statistically-derived dataset and is not representative of any actual single storm event. Rather this represents the flood depth with a given likelihood of exceedance for all points across the entire model domain.

- **Units:** ft
- **Spatial resolution:** varied
- **Temporal resolution:** Decadal

### Expected Annual Damages, Dollars

This dataset is the flood damage estimates (in dollars), reported as a statistically-derived expected annual value. To estimate flooding potential, our analysis considers storms of different intensity and tracks, and their expected probability of occurring in any one year. The flood depths resulting from those storms change over time as the coast degrades and sea level rise increases water levels. Rather than selecting a single probability of flooding or a single time period, this dataset combines the total damage from all possible flood events considered and the likelihood of each event occurring, or "expected annual damages". This damage is reported both in dollars (EADD) and in the number of structures damaged (EASD) and the degree of damage experienced.

- **Units:** $
- **Spatial resolution:** CLARA Community
- **Temporal resolution:** Decadal

### Annual Exceedance Damages, Dollars

This dataset is the flood damage estimates (in dollars), reported out at individual annual exceedance probabilities. To estimate flooding potential, our analysis considers storms of different intensity and tracks, and their expected probability of occurring in any one year. The flood depths resulting from those storms change over time as the coast degrades and sea level rise increases water levels. This dataset reports out the damage with a given likelihood of occurring in any given year, with a defined "annual exceedance probability". Like EADD/EASD, this is a statistically-derived dataset and is not representative of any actual single storm event. Rather this represents the flood damages with a given likelihood of exceedance for all points across the entire model domain. This damage is reported both in dollars and in the number of structures damaged.

- **Units:** $
- **Spatial resolution:** CLARA Community
- **Temporal resolution:** Decadal

### Expected Annual Structural Damage

This dataset is the flood damage estimates (in dollars), reported as a statistically-derived expected annual value. To estimate flooding potential, our analysis considers storms of different intensity and tracks, and their expected probability of occurring in any one year. The flood depths resulting from those storms change over time as the coast degrades and sea level rise increases water levels. Rather than selecting a single probability of flooding or a single time period, this dataset combines the total damage from all possible flood events considered and the likelihood of each event occurring, or "expected annual damages". This damage is reported both in dollars (EADD) and in the number of structures damaged (EASD) and the degree of damage experienced.

- **Units:** structure equivalents
- **Spatial resolution:** CLARA Community
- **Temporal resolution:** Decadal

### Annual Exceedance Annual Structural Damage

This dataset is the flood damage estimates (in dollars), reported out at individual annual exceedance probabilities. To estimate flooding potential, our analysis considers storms of different intensity and tracks, and their expected probability of occurring in any one year. The flood depths resulting from those storms change over time as the coast degrades and sea level rise increases water levels. This dataset reports out the damage with a given likelihood of occurring in any given year, with a defined "annual exceedance probability". Like EADD/EASD, this is a statistically-derived dataset and is not representative of any actual single storm event. Rather this represents the flood damages with a given likelihood of exceedance for all points across the entire model domain. This damage is reported both in dollars and in the number of structures damaged.

- **Units:** structure equivalents
- **Spatial resolution:** CLARA Community
- **Temporal resolution:** Decadal
