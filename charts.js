function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  buildBarChart(newSample);
  buildGaugeChart(newSample);
  buildBubbleChart(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildBarChart(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var resultArray = data
    .samples 
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    .filter(sampleObj => {
      return sampleObj.id == sample
    });

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var top_ten_otu_ids = result.otu_ids.slice(0,10).map(numbericIds => {
      return "OTU " + numbericIds;
    }).reverse();
    var top_ten_otu_labels = results.otu_labels.slice(0,10).reverse();
    var top_ten_sample_values = results.sample_values.slice(0,10).reverse();


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = top_ten_otu_ids

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: top_ten_sample_values,
        y: top_ten_otu_ids,
        text: top_ten_otu_labels,
        name: "Top 10",
        type: "bar",
        orientation: "h"
      }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout)
  });
}
// Bar and Bubble charts
// Create the buildCharts function.
function buildBubbleCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    var resultArray = data
    .samples
    .filter(sampleObj => {
    return sampleObj.id == sample
    });

    var result = resultArray[0];
        
    var otu_ids = result.otu_ids.map(numericIds => {
      return numericIds;
    }).reverse();
    
    var sample_values = result.sample_values.reverse();
    var otu_labels = result.otu_labels.reverse();

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values
        }
      };
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 
  });
}

// Create the buildChart function.
function buildGaugeChart(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var metadata = data.metadata;

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArray = metadata
    .filter(sampleObj => {
      return sampleObj.id == sample
    });
    console.log(resultArray);

    // 2. Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];
    console.log(result);

    // 3. Create a variable that holds the washing frequency.
    var wash_freq = result.wfreq;
    console.log(wash_freq);
   
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: {x:[0,1], y:[0,1]},
        value: wash_freq,
        title: {text: "Belly Button Washing Frequency <br> Scrubs Per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range:[null,10]},
          bar: {color: "black"},
          steps: [
            {range: [0,2], color: 'rgba(0,0,0,0.5)'},
            {range: [2,4], color: 'rgba(183,28,28,0.5)'},
            {range: [4,6], color: 'rgba(249,168,37,0.5)'},
            {range: [6,8], color: 'rgba(110,154,22,0.5)'},
            {range: [8,10], color: 'rgba(14,127,0,0.5)'},
          ]
        }
      }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600,
      height: 500,
      margin: {t:0, b:0}
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}

