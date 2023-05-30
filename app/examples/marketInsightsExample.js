/*
  If you DO NOT have an API key and would like to see what sample data looks
  like in the UI, you will need to UNCOMMENT two sections in this file.
  Section 1 = lines 64-66
  Section 2 = lines 77-79
*/

// Use getMarketInsightData to get real data for a specific market insight
const getMarketInsightData = async (measure, regionType, regionId) => {
  const url = `/api/marketInsights/measures/${measure}/${regionType}?region_id=${regionId}`;

  try {
    const apiRes = await fetch(url);
    if (!apiRes.ok) {
      return { error: true, data: null };
    }
    const data = await apiRes.json();
    return { error: false, data: data };
  } catch (error) {
    console.error(error);
    return { error: true, data: null };
  }
};

// getSampleData fetches sample Market Insight data values
const getSampleData = async (measure) => {
  const sampleRes = await fetch(`../fixtures/${measure}.json`);
  const sampleData = await sampleRes.json();
  const sampleDataObj = {
    data: sampleData,
  };

  return sampleDataObj;
};

const measures = [
  "sale_vs_list_price_percent",
  "median_list_price_dollars",
  "price_per_sqft_dollars",
  "inventory_count",
  "days_of_inventory_count",
  "median_days_on_market",
];

const renderMarketInsights = async (measures, regionType, regionId) => {
  const marketInsightsArray = [];
  for (let i = 0; i < measures.length; i++) {
    // Get real Market Insight Data from Plunk's API
    let marketInsightMeasureValues = [];
    marketInsightMeasureValues = await getMarketInsightData(
      measures[i],
      regionType,
      regionId
    );

    // if (marketInsightMeasureValues.data === null) {
    //   marketInsightMeasureValues = await getSampleData(measures[i]);
    // }

    // Get real Market Insight overlay data from Plunk's API
    let marketInsightMeasureOverlayValues = [];
    const overlayMeasure = `${measures[i]}_90_days`;
    marketInsightMeasureOverlayValues = await getMarketInsightData(
      overlayMeasure,
      regionType,
      regionId
    );

    // if (marketInsightMeasureOverlayValues.data === null) {
    //   marketInsightMeasureOverlayValues = await getSampleData(overlayMeasure);
    // }

    // push market insight data object into market insights array
    marketInsightsArray.push({
      measure: measures[i],
      values: marketInsightMeasureValues.data.values,
      // Gray line representing sale_vs_list_price_percent_90_days as overlayValues
      overlayValues: marketInsightMeasureOverlayValues.data.values,
    });
  }

  // use the pre-built Market Insights component to render the graphs with real data
  if (!!PlunkWidget) {
    PlunkWidget.initPlunkComponent([
      {
        id: "1",
        type: "grouped-charts",
        showOverlayValuesReference: true, // Use a boolean to show reference values for the FIRST chart only.
        data: marketInsightsArray,
      },
    ]);
  }
};

// call the renderMarketInsights function to see the Market Insights in your browser
renderMarketInsights(measures, "zipcode", "90210");
