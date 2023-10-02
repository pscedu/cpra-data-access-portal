# Master Plan Data Access Portal Documentation
This page was last updated September 29, 2023.

This is the documentation for the [2023 Louisiana Coastal Master Plan Data Access Portal (MP-DAP)](https://mpdap.coastal.la.gov). For questions or comments, please e-mail [masterplan@la.gov](mailto:masterplan@la.gov). 

The 2023 Coastal Master Plan is Louisiana's roadmap for adapting to this uncertain environment. It guides investment in restoration and risk-reduction projects that will allow future generations to continue to call the coast home.

But how do we plan for an uncertain future? While we don’t know exactly what the future may bring, the master plan uses the best available science to help make informed decisions using planning scenarios. A scenario is a plausible version of the future based on our knowledge of climate drivers like temperature, sea level rise, and storm intensity. Scenarios are not predictions, but possibilities for what the future coast might look like based on the best available science.

The 2023 Coastal Master Plan uses two scenarios to guide its recommendations: a lower scenario, and a higher scenario. In the lower, more moderate scenario, the Gulf of Mexico would rise by one-point-six feet over the next fifty years. In the higher, more severe scenario, sea levels rise by two and a half feet, storms are stronger, and the risks are greater. These scenarios are startling, but it’s important to keep in mind that they are not forecasts. Rather, they are tools that help the state effectively allocate resources to prepare for the future.

Projects selected for the 2023 Coastal Master Plan were chosen because they provide significant benefits under both the lower and higher scenarios. This approach allows the state to make high-confidence decisions on how to invest with no regrets, no matter what the future may bring.

The Master Plan Data Access Portal is undergoing active development - periodic updates, improved functionality, and additional datasets will be continued to be released throughout 2023 and early 2024.  

## Reference Documents

All technical appendices for the 2023 Master Plan are available on the [Master Plan website](https://coastal.la.gov/our-plan/2023-coastal-master-plan/). Documentation pertaining to the models used for the master plan development process, including the production of all data available in the MP-DAP are summarized in:

- [APPENDIX C: USE OF PREDICTIVE MODELS IN THE 2023 COASTAL MASTER PLAN and its attachments](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#C)
- [APPENDIX D: OVERVIEW OF IMPROVEMENTS TO LANDSCAPE MODELING (ICM) FOR 2023 and its attachments](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#D)

## Master Plan Year Conventions

The Master Plan document is a plan for the next 50 years; however, the landscape modeling in the ICM requires a two year spin-up period to ensure a stable model. For public-facing documents prepared for the 2023 Master Plan, the spin-up period was generally not included. However, here in the Data Access Portal, all data is being served up, including the two years of model spin-up. The timesteps in the MP-DAP refer to the elapsed time since the start of the model run. The numbering of years and how that compares to the outputs reported in the main Master Plan document are shown below.

- 01/01/2006 - 12/31/2018 - model calibration/validation hindcast period
- 01/01/2019 - start of model spinup
- 12/31/2019 - end of Elapsed Year 01
- 12/31/2020 - end of Elapsed Year 02 - End of this timestep is Initial Conditions for Future Without Action (FWOA) and Future With Master Plan (FWMP)
- 12/31/2021 - end of Elapsed Year 03
- 12/31/2030 - end of Elapsed Year 12 - This is referred to as year 10 in the main Master Plan report
- 12/31/2040 - end of Elapsed Year 22 - This is referred to as year 20 in the main Master Plan report
- 12/31/2050 - end of Elapsed Year 32 - This is referred to as year 30 in the main Master Plan report
- 12/31/2060 - end of Elapsed Year 42 - This is referred to as year 40 in the main Master Plan report
- 12/31/2070 - end of Elapsed Year 52 - This is referred to as year 50 in the main Master Plan report

Note that while we use calendar years for ease of explanation above, all data for model spinup and future scenario simulations (01/01/2019-12/31/2070) are generated from assumptions unique to each environmental scenario. Elapsed years should be used for communication to emphasize that these model outputs are **projections** of various assumed future scenarios and are **not forecasts** of coastal Louisiana at a specific date in the future.

## Metadata

All geospatial data available in the MP-DAP uses the [EPSG:26915 (NAD83/UTM zone 15N) projection](https://epsg.io/26915). All elevation data is provided relative to the NAVD88 Geoid 12B vertical datum; unless labeled otherwise, SI units will be used. CLARA-produced flood depths are a notable exception; they default to US-feet. If in doubt, please email [masterplan@la.gov](mailto:masterplan@la.gov) for clarifications.

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

Ecoregions are used to summarize model output for the 2023 Coastal Master Plan. Ecoregions were defined first by coastal basin, but then further refined by hydrologic pathways and other prominent landscape features (either natural or manmade). Ecoregions were further split into barrier island subregions if the ICM-BIDEM model domain overlapped with the original ecoregion. The ecoregions used for the 2023 Master Plan are aggregated groups of ICM-Hydro compartments.

- **Units:** n/a
- **Spatial resolution:** varied
- **Temporal resolution:** n/a

### Model Geometries: CLARA communities

The Risk Assessment Team aggregates EADD and EASD results at the master plan community level. The team identified 204 communities using parish or municipal boundaries that were further categorized based on the community’s location either inside or outside of existing structural protection, resulting in 374 distinct geographic areas.

- **Units:** n/a
- **Spatial resolution:** varied
- **Temporal resolution:** n/a

### Model Geometries: 2010 Census Blocks

Population modeling for the 2023 Cosatal Master Plan was conducted on 2010 United States Census data. The Census Blocks are boundary defined and used by the United States Census Bureau.

- **Units:** n/a
- **Spatial resolution:** varied
- **Temporal resolution:** n/a

### Model Geometries: 2010 Census Block Groups

Population change rates were modeled for the 2023 Cosatal Master Plan at the 2010 United States Census Block Group level. 

- **Units:** n/a
- **Spatial resolution:** varied
- **Temporal resolution:** n/a

### Model Geometries: QAQC Extraction points

Prior to starting simulations for the 2023 Coastal Master Plan, a number of locations were identified as "model save points". These points are locations at which all model data, down to a specific pixel, is saved in order to conduct quality assurance and quality control (QAQC) on model processes and simulations. There are three categories of QAQC extraction points: CRMS locations – every observation station within the Coastwide Reference Monitoring System (CRMS) was selected as a save point; Transects – several transects were deliberately placed at a variety of locations around the coastal domain; and randomly placed QAQC points.

- **Units:** n/a
- **Spatial resolution:** n/a
- **Temporal resolution:** n/a

### Initial Conditions: Land/Water

Landscape composition developed from satellite imagery collected in 2018, this represent the initial conditions used for the 2023 master plan development process. Full documentation provided in 2023 Coastal Master Plan: [Attachment B1](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#B). The raster values representing landscape composition are defined as follows: 1=vegetated wetland; 2=open water; 3=unvegetated wetland/bare ground; 4=developed/upland; 5=flotant marsh.

- **Units:** categorical
- **Spatial resolution:** 30-m raster
- **Temporal resolution:** n/a

### Initial Conditions: Vegetation Cover LULC

Landscape composition developed from satellite imagery collected in 2018, this represents the vegetation coverage of the initial conditions used for the 2023 master plan development process. Satellite imagery was classified to the predominant vegetation species included in ICM-LAVegMod. Full documentation provided in 2023 Coastal Master Plan: [Attachment B1](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#B).

- **Units:** categorical
- **Spatial resolution:** 10-m raster
- **Temporal resolution:** n/a

### Initial Conditions: FFIBS

Landscape composition developed from satellite imagery collected in 2018, this represents the vegetation coverage of the initial conditions used for the 2023 master plan development process, that is then reclassified into a weighted FFIBS score for each of the ICM-LAVegMod 480-m grid cells. Documentation for the vegetation classification is provided in 2023 Coastal Master Plan: [Attachment B1](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#B). Documentation on the weighted FFIBS score methodology is provided in 2023 Coastal Master Plan: [Attachment C8](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#C) and [Attachment D2](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#D). FFIBS scores range from 0 to 24 for areas that are vegetated wetland. All other (non-vegetated wetland) areas use the following classifications: 200=open water; 300=unvegetated wetland/bare ground; 400=developed/upland; 500=flotant marsh.

- **Units:** weighted FFIBS score
- **Spatial resolution:** 30-m raster
- **Temporal resolution:** n/a

### Marsh Edge Erosion

This is a raster of historic marsh edge erosion rates (in m/yr) that were quantified from high resolution aerial imagery for all marsh edge areas with at least 300-m of omnidirectional fetch. The historic rates are used, in conjunction with the number of elapsed model years to determine whether any given edge pixel would be eroded during a given model year. For full documentation on this dataset, please refer to [Attachment B1](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#B).

- **Units:** m/yr
- **Spatial resolution:** 30-m raster
- **Temporal resolution:** n/a

### Deep Subsidence

The deep subsidence rates (mm/yr; positive indicates downward movement) were developed for use as a boundary condition in the 2023 Coastal Master Plan. The interpolated surface was developed from CORS observational GPS stations located throughout Coastal Louisiana - with supplemental observation points from the CRMS benchmark surveys. Refer to full documentation in [Attachment B3](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#B). In the master plan models, these deep subsidence rates are combined with variable (both in space and potentially across assumed scenarios) shallow subsidence rates that were derived from CRMS measurements. Furthermore, both the deep and shallow subsidence rates have all vertical accretion rates removed; the ICM dynamically models vertical accretion as a function of both mineral sediment deposition and organic matter accumulation in the vegetated areas. Therefore, for a total elevation change rate, four different datasets must be combined by the model: deep subsidence (downward movement), shallow subsidence (downward movement), mineral deposition (upward movement), and organic accretion (upward movement).This raster represents deep subsidence rates in coastal regions of Louisiana.

- **Units:** mm/yr
- **Spatial resolution:** 30-m raster
- **Temporal resolution:** n/a

### Shallow Subsidence

The shallow subsidence rates (mm/yr; positive indicates downward movement) were developed for use as a boundary condition in the 2023 Coastal Master Plan. These rates were derived from the Coastwide Reference Monitoring System (CRMS) surface elevation and vertical accretion datasets. These rates are highly spatially variable, and were therefore averaged for each ecoregion used in the 2023 Master Plan. Descriptive statistics of shallow subsidence rates for each ecoregion are provided in this tabular file. A shapefile of the ecoregions is provided for download via the "Model Geometries" reference dataset. Subsidence rates were assigned to each ecoregion as defined by the future environmental scenarios (Appendix B). Refer to full documentation in [Appendix B and Attachment B3](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#B). In the master plan models, these shallow subsidence rates are combined with deep subsidence rates that were derived from GPS data. Furthermore, both the deep and shallow subsidence rates have all vertical accretion rates removed; the ICM dynamically models vertical accretion as a function of both mineral sediment deposition and organic matter accumulation in the vegetated areas. Therefore, for a total elevation change rate, four different datasets must be combined by the model: deep subsidence (downward movement), shallow subsidence (downward movement), mineral deposition (upward movement), and organic accretion (upward movement).This raster represents deep subsidence rates in coastal regions of Louisiana.

- **Units:** mm/yr
- **Spatial resolution:** Ecoregion
- **Temporal resolution:** n/a

### 2023 Master Plan Projects

This is a geodatabase package that includes the spatial extent of all projects included in the 2023 Master Plan.

- **Units:** n/a
- **Spatial resolution:** Project
- **Temporal resolution:** Annual (implementation year)

### NOAA Tidal Station Data Analysis

This is an archive package that contains Excel workbooks that were used to analyze all observational tidal data from the NOAA tide stations used as boundary conditions in the ICM-Hydro model. The data was downloaded for the 2006-2018 time period. The hourly water level from each tide station was decomposed into numerous tidal constituents (e.g., astronomic component, storm surge component, wind/pressure forcings subtidal component, etc.). Each station was also had gauge-specific local subsidence rates calculated from gauge-specific relative sea level rise rates and larger Gulf of Mexico-wide observations of mean sea level rise as determined from satellite altimetry data.

- **Units:** n/a
- **Spatial resolution:** varied
- **Temporal resolution:** n/a

### Attachment B2: Supplemental Materials

This is an archive package that contains multiple files used to develop boundary condition/environmental forcing timeseries for use in the ICM simulations. Full documentation and discussion of these files is available in [Attachment B2](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#B).

- **Units:** n/a
- **Spatial resolution:** varied
- **Temporal resolution:** n/a

### Land Change

This is a raster that shows how the landscape composition has changed from initial conditions. If the land change is under a Future Without Action (FWOA), the raster values will be two digits. The first digit represents the landscape under initial conditions, and the second digit represents the landscape at the current year. For example, if the FWOA land change at year 10 has a value of 12, this indicates that the pixel started as land (1) in initial conditions and was converted to water (2) by year 10. If the land change is under a Future With Master Plan (FWMP), the raster values will be three digits. The first two digits will be identical to the FWOA land change, and the third digit will represent the landscape under FWMP. For example, if the FWMP land change at year 10 has a value of 121, this indicates that the pixel started as land (1) in initial conditions and was converted to water (2) by year 10 under FWOA; however, with the implementation of the Master Plan, this pixel was kept as land at year 10 under FWMP. The values of each digit representing landscape composition are defined as follows: 1=vegetated wetland; 2=open water; 3=unvegetated wetland/bare ground; 4=developed/upland; 5=flotant marsh.

- **Units:** categorical
- **Spatial resolution:** 30-m raster
- **Temporal resolution:** Annual (decadal in the MPDV)

### Vegetation Type: FFIBS

The vegetation data can be viewed in one of two different ways; the first is to use the marsh classification, which uses a weighted score to classify the vegetation as Fresh Forested, Fresh Marsh, Intermediate Marsh, Brackish Marsh, or Saline Marsh, or FFIBS. For more information on the weighted FFIBS score methodology, see [Attachment C8](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#C). FFIBS scores range from 0 to 24 for areas that are vegetated wetland. All other (non-vegetated wetland) areas use the following classifications: 200=open water; 300=unvegetated wetland/bare ground; 400=developed/upland; 500=flotant marsh. The second method is to summarize the mixture of vegetation species present into one of 15 vegetation community types, or VCT. For more information on which species are commonly associated with each VCT, see: [Snedden, G.A., 2019. Patterning emergent marsh vegetation assemblages in coastal Louisiana, USA, with unsupervised artificial neural networks. Applied Vegetation Science. 22: 213-229. DOI: 10.1111.avsc.12425](https://doi.org/10.1111/avsc.12425).

- **Units:** weighted FFIBS score
- **Spatial resolution:** 30-m raster
- **Temporal resolution:** Annual (decadal in the MPDV)

### Vegetation Type: VCT

The vegetation data can be viewed in one of two different ways; the first is to use the marsh classification, which uses a weighted score to classify the vegetation as Fresh Forested, Fresh Marsh, Intermediate Marsh, Brackish Marsh, or Saline Marsh, or FFIBS. For m ore information on the weighted FFIBS score methodology, see [Attachment C8](https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#C). The second method is to summarize the mixture of vegetation species present into one of 15 vegetation community types, or VCT. For more information on which species are commonly associated with each VCT, see: [Snedden, G.A., 2019. Patterning emergent marsh vegetation assemblages in coastal Louisiana, USA, with unsupervised artificial neural networks. Applied Vegetation Science. 22: 213-229. DOI: 10.1111.avsc.12425](https://doi.org/10.1111/avsc.12425).

- **Units:** categorical
- **Spatial resolution:** 30-m raster
- **Temporal resolution:** Annual (decadal in the MPDV)

### Flood Depth

This dataset is the flood depth estimates (in feet), reported out at individual annual exceedance probabilities. To estimate flooding potential, our analysis considers storms of different intensity and tracks, and their expected probability of occurring in any one year. The flood depths resulting from those storms change over time as the coast degrades and sea level rise increases water levels. This dataset reports out the flood depth with a given likelihood of occurring in any given year, with a defined "annual exceedance probability". This is a statistically-derived dataset and is not representative of any actual single storm event. Rather this represents the flood depth with a given likelihood of exceedance for all points across the entire model domain.

- **Units:** ft
- **Spatial resolution:** varied
- **Temporal resolution:** Decadal

### Expected Annual Damages, Dollars

This dataset is the flood damage estimates (in dollars), reported as a statistically-derived expected annual value. To estimate flooding potential, our analysis considers storms of different intensity and tracks, and their expected probability of occurring in any one year. The flood depths resulting from those storms change over time as the coast degrades and sea level rise increases water levels. Rather than selecting a single probability of flooding or a single time period, this dataset combines the total damage from all possible flood events considered and the likelihood of each event occurring, or "expected annual damages". This damage is reported both in dollars (EADD) and in the number of structures damaged (EASD) and the degree of damage experienced. Three values are reported out for each exceedance/year combination: median estimates of damages as well as estimates for the 10th and 90th percentile of flood damages. This data is available by the type of asset that is experiencing flood risk. Asset types are classified as following: 1=Small Residential (single-family, manufactured homes, duplex); 2=Other Multi-family residential; 3=Commercial, Industrial, or Agricultural; 4=Other structural (e.g., public, educational, religious); 5=Non-structural assets (e.g., crops, vehicles, roads, etc.); 6=All asset types combined. Downloaded data can be joined to the CLARA Community available in the Model Grid reference files; the 'geometry' integer ID in the exported table should be joined to the 'MP_Community_ID_Final' values in the 'Model Geometries: clara_community' polygon dataset.

- **Units:** $
- **Spatial resolution:** CLARA Community
- **Temporal resolution:** Decadal

### Annual Exceedance Damages, Dollars

This dataset is the flood damage estimates (in dollars), reported out at individual annual exceedance probabilities. To estimate flooding potential, our analysis considers storms of different intensity and tracks, and their expected probability of occurring in any one year. The flood depths resulting from those storms change over time as the coast degrades and sea level rise increases water levels. This dataset reports out the damage with a given likelihood of occurring in any given year, with a defined "annual exceedance probability". Like EADD/EASD, this is a statistically-derived dataset and is not representative of any actual single storm event. Rather this represents the flood damages with a given likelihood of exceedance for all points across the entire model domain. This damage is reported both in dollars and in the number of structures damaged. Three values are reported out for each exceedance/year combination: median estimates of damages as well as estimates for the 10th and 90th percentile of flood damages. This data is available by the type of asset that is experiencing flood risk. Asset types are classified as following: 1=Small Residential (single-family, manufactured homes, duplex); 2=Other Multi-family residential; 3=Commercial, Industrial, or Agricultural; 4=Other structural (e.g., public, educational, religious); 5=Non-structural assets (e.g., crops, vehicles, roads, etc.); 6=All asset types combined. Downloaded data can be joined to the CLARA Community available in the Model Grid reference files; the 'geometry' integer ID in the exported table should be joined to the 'MP_Community_ID_Final' values in the 'Model Geometries: clara_community' polygon dataset.

- **Units:** $
- **Spatial resolution:** CLARA Community
- **Temporal resolution:** Decadal

### Expected Annual Structural Damage

This dataset is the flood damage estimates (in structure equivalents), reported as a statistically-derived expected annual value. To estimate flooding potential, our analysis considers storms of different intensity and tracks, and their expected probability of occurring in any one year. The flood depths resulting from those storms change over time as the coast degrades and sea level rise increases water levels. Rather than selecting a single probability of flooding or a single time period, this dataset combines the total damage from all possible flood events considered and the likelihood of each event occurring, or "expected annual damages". This damage is reported both in dollars (EADD) and in the number of structures damaged (EASD) and the degree of damage experienced. Three values are reported out for each exceedance/year combination: median estimates of damages as well as estimates for the 10th and 90th percentile of flood damages. This data is available by the type of asset that is experiencing flood risk. Asset types are classified as following: 1=Small Residential (single-family, manufactured homes, duplex); 2=Other Multi-family residential; 3=Commercial, Industrial, or Agricultural; 4=Other structural (e.g., public, educational, religious); 5=Non-structural assets (e.g., crops, vehicles, roads, etc.); 6=All asset types combined. Downloaded data can be joined to the CLARA Community available in the Model Grid reference files; the 'geometry' integer ID in the exported table should be joined to the 'MP_Community_ID_Final' values in the 'Model Geometries: clara_community' polygon dataset.

- **Units:** structure equivalents
- **Spatial resolution:** CLARA Community
- **Temporal resolution:** Decadal

### Annual Exceedance Annual Structural Damage

This dataset is the flood damage estimates (in structure equivalents), reported out at individual annual exceedance probabilities. To estimate flooding potential, our analysis considers storms of different intensity and tracks, and their expected probability of occurring in any one year. The flood depths resulting from those storms change over time as the coast degrades and sea level rise increases water levels. This dataset reports out the damage with a given likelihood of occurring in any given year, with a defined "annual exceedance probability". Like EADD/EASD, this is a statistically-derived dataset and is not representative of any actual single storm event. Rather this represents the flood damages with a given likelihood of exceedance for all points across the entire model domain. This damage is reported both in dollars and in the number of structures damaged. Three values are reported out for each exceedance/year combination: median estimates of damages as well as estimates for the 10th and 90th percentile of flood damages. This data is available by the type of asset that is experiencing flood risk. Asset types are classified as following: 1=Small Residential (single-family, manufactured homes, duplex); 2=Other Multi-family residential; 3=Commercial, Industrial, or Agricultural; 4=Other structural (e.g., public, educational, religious); 5=Non-structural assets (e.g., crops, vehicles, roads, etc.); 6=All asset types combined. Downloaded data can be joined to the CLARA Community available in the Model Grid reference files; the 'geometry' integer ID in the exported table should be joined to the 'MP_Community_ID_Final' values in the 'Model Geometries: clara_community' polygon dataset.

- **Units:** structure equivalents
- **Spatial resolution:** CLARA Community
- **Temporal resolution:** Decadal

### Surge Water Surface Elevations by Exceedance

This dataset is the statistically-derived expected annual storm surge still water elevation (in feet, relative to NAVD88) extracted at the centroid of each ICM-Hydro compartment. See description of Expected Annual Damage for a brief explanation of the statistical approach used. Three values are reported out for each exceedance/year combination: median estimates of storm surge as well as estimates for the 10th and 90th percentile.

- **Units:** NAVD88 ft
- **Spatial resolution:** Hydro Compartment
- **Temporal resolution:** Decadal

### Wave Heights by Exceedance

This dataset is the statistically-derived expected significant wave height (in feet) extracted at the centroid of each ICM-Hydro compartment. See description of Expected Annual Damage for a brief explanation of the statistical approach used. Three values are reported out for each exceedance/year combination: median estimates of wave height as well as estimates for the 10th and 90th percentile of flood damages.

- **Units:** ft
- **Spatial resolution:** Hydro Compartment
- **Temporal resolution:** Decadal

### Surge Water Surface Elevations by Storm

This dataset contains the maximum stillwater storm surge elevation (in feet, relative to NAVD88) extracted at the centroid of each ICM-Hydro compartment for each synthetic tropical cyclone modeled in the 2023 Master Plan synthetic storm suite. The Storm ID number corresponds to the ID of the storm in the overall JPM-OS 645 storm suite.

- **Units:** NAVD88 ft
- **Spatial resolution:** Hydro Compartment
- **Temporal resolution:** Decadal

### Wave Heights by Storm

This dataset contains the significant wave height (in feet) extracted at the centroid of each ICM-Hydro compartment for each synthetic tropical cyclone modeled in the 2023 Master Plan synthetic storm suite. The Storm ID number corresponds to the ID of the storm in the overall JPM-OS 645 storm suite.

- **Units:** ft
- **Spatial resolution:** Hydro Compartment
- **Temporal resolution:** Decadal

### Nonstructural Expected Annual Damage, Dollars

This dataset is the flood damage estimates (in dollars) remaining after implementation of non-structural flood mitigation measures. It is reported as a statistically-derived expected annual value. To estimate flooding potential, our analysis considers storms of different intensity and tracks, and their expected probability of occurring in any one year. The flood depths resulting from those storms change over time as the coast degrades and sea level rise increases water levels. Rather than selecting a single probability of flooding or a single time period, this dataset combines the total damage from all possible flood events considered and the likelihood of each event occurring, or "expected annual damages". This damage is reported both in dollars (EADD) and in the number of structures damaged (EASD) and the degree of damage experienced. This data is available by the type of asset that is experiencing flood risk. Asset types are classified as following: 1=Small Residential (single-family, manufactured homes, duplex); 2=Other Multi-family residential; 3=Commercial, Industrial, or Agricultural; 4=Other structural (e.g., public, educational, religious); 5=Non-structural assets (e.g., crops, vehicles, roads, etc.); 6=All asset types combined. Downloaded data can be joined to the CLARA Community available in the Model Grid reference files; the 'geometry' integer ID in the exported table should be joined to the 'MP_Community_ID_Final' values in the 'Model Geometries: clara_community' polygon dataset.

- **Units:** $
- **Spatial resolution:** CLARA Community
- **Temporal resolution:** Decadal

### Nonstructural Expected Annual Structural Damage

This dataset is the flood damage estimates (in dollars) remaining after implementation of non-structural flood mitigation measures. It is reported as a statistically-derived expected annual value. To estimate flooding potential, our analysis considers storms of different intensity and tracks, and their expected probability of occurring in any one year. The flood depths resulting from those storms change over time as the coast degrades and sea level rise increases water levels. Rather than selecting a single probability of flooding or a single time period, this dataset combines the total damage from all possible flood events considered and the likelihood of each event occurring, or "expected annual damages". This damage is reported both in dollars (EADD) and in the number of structures damaged (EASD) and the degree of damage experienced. This data is available by the type of asset that is experiencing flood risk. Asset types are classified as following: 1=Small Residential (single-family, manufactured homes, duplex); 2=Other Multi-family residential; 3=Commercial, Industrial, or Agricultural; 4=Other structural (e.g., public, educational, religious); 5=Non-structural assets (e.g., crops, vehicles, roads, etc.); 6=All asset types combined. Downloaded data can be joined to the CLARA Community available in the Model Grid reference files; the 'geometry' integer ID in the exported table should be joined to the 'MP_Community_ID_Final' values in the 'Model Geometries: clara_community' polygon dataset.

- **Units:** structure equivalents
- **Spatial resolution:** CLARA Community
- **Temporal resolution:** Decadal

### Exposure

This dataset presents the count of assets that are exposed to various depths of flooding, as reported out for different annual exceedance levels. Three types of flooding exposure are reported out. The first, "exposure", is a count of structures located where there is flooding over the ground in the vicinity of the structure. The second, "moderate exposure" is a count of structures where there is flooding at or above the first floor elevation of the structure (these structures are also counted in the first category of exposure). The third category, "severe exposure" is a count of structures where there is at least 2-ft of flooding above the first floor elevation of the structure (these structures are also counted in "moderate exposure" count). These exposure counts are reported out for all asset types included in the CLARA flood risk model. Asset types are classified as following: 1=Small Residential (single-family, manufactured homes, duplex); 2=Other Multi-family residential; 3=Commercial, Industrial, or Agricultural; 4=Other structural (e.g., public, educational, religious); 5=Non-structural assets (e.g., crops, vehicles, roads, etc.); 6=All asset types combined. This exposure data is also reported out for critical infrastructure and historic properties present in the coastal zone. Downloaded data can be joined to the CLARA Community available in the Model Grid reference files; the 'geometry' integer ID in the exported table should be joined to the 'MP_Community_ID_Final' values in the 'Model Geometries: clara_community' polygon dataset.

- **Units:** structures
- **Spatial resolution:** CLARA Community
- **Temporal resolution:** Decadal

### Salinity

This is the model-predicted salinity (in parts per thousand, ppt) as simulated by ICM-Hydro. Values are provided for each model node (e.g., compartment) in the ICM-Hydro grid. Values are provided for daily mean salinity, and annual mean salinity.

- **Units:** ppt
- **Spatial resolution:** Hydro Compartment
- **Temporal resolution:** Daily/Annual

### Water Level

This is the model-predicted water surface elevation, or stage, (in meters relative to NAVD88) as simulated by ICM-Hydro. Values are provided for each model node (e.g., compartment) in the ICM-Hydro grid. Values are provided for daily mean and annual mean values.

- **Units:** NAVD88 m
- **Spatial resolution:** Hydro Compartment
- **Temporal resolution:** Daily/Annual

### Water Level Variability

This is the model-predicted water level variability (in meters) as simulated by ICM-Hydro. Values are provided for each model node (e.g., compartment) in the ICM-Hydro grid. Values are provided for annual values. Water level variability is defined by ICM-LAVegModas the standard deviation of the water level; this is an indication of tidal connectivity/tidal range.

- **Units:** m
- **Spatial resolution:** Hydro Compartment
- **Temporal resolution:** Annual

### Total Suspended Solids

This is the model-predicted total suspended solids, TSS, (in mg/L) as simulated by ICM-Hydro. Values are provided for each model node (e.g., compartment) in the ICM-Hydro grid. Values are provided for daily and annual mean values.

- **Units:** mg/L
- **Spatial resolution:** Hydro Compartment
- **Temporal resolution:** Daily/Annual

### Temperature

This is the model-predicted daily mean water temperature (in degrees Celsius) as simulated by ICM-Hydro. Values are provided for each model node (e.g., compartment) in the ICM-Hydro grid.

- **Units:** degrees Celsius
- **Spatial resolution:** Hydro Compartment
- **Temporal resolution:** Daily
