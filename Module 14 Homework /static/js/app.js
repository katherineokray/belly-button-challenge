//1. Use D3 library to readin json from url 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//use d3 to make an API call to retreive data from url
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);


//function to initialize the dashboard
function init() {
  d3.json(url).then(function(data) {

  // use d3 to select the dropdown menu
  let dropDown = d3.select("#selDataset");
  let dropDownList = data.names;

  // add values to the dropdown menu
  dropDownList.forEach((id) => {
  dropDown.append("option").text(id).property("value", id);
  });
  let case_id = dropDownList[0];

  //build the initial plots
  barChart(case_id);
  demographyData (case_id);
  bubbleChart(case_id);
 });
}

//function to display the sample metadata, i.e., an individual's demographic information.
function demographyData(cases) {

  //use d3 to retreive data
  d3.json(url).then((data) => {
    let demoInfo = data.metadata;

    // use the filter function to filter data based on the sample value
    let demoData = demoInfo.filter(row => row.id == cases);

    //retreive the first element in the array 
    let demoDataList = demoData[0];

    //use d3 to select the html element for adding the demographic information
    d3.select("#sample-metadata").html("");

    //add key values pairs for the demographic data
    Object.entries(demoDataList).forEach(([key,value]) => {
    d3.select("#sample-metadata").append("h5").text(`${key}:${value}`);  
        });
});
}
//function to draw a bar graph
function barChart(cases) {

  //use d3 ro retreive data
  d3.json(url).then((data) => {
  let sampleInfo = data.samples;

  //use the filter funtion to filter data based on the sample value
  let response = sampleInfo.filter(row => row.id == cases);

  //retreive the first element in the array
  let responseArray = response[0];

  //create the bar chart using Plotly
  let trace = {
    x : (responseArray.sample_values).slice(0,10).reverse(),
    y : (responseArray.otu_ids).slice(0,10).map(id => `OTU ${id}`).reverse(),
    text: (responseArray.otu_labels).slice(0,10).reverse(),
    type: "bar",
    orientation: "h"
    }
    let layout ={
      title : "Belly Button Bacteria"
}
    let data1 = [trace]
    Plotly.newPlot("bar", data1, layout);
})
}

//function to create a bubble chart
function bubbleChart(cases) {

  //use d3 ro retreive data
  d3.json(url).then((data) => {
    let sampleInfo = data.samples;

    //use the filter funtion to filter data based on the sample value
    let response = sampleInfo.filter(row => row.id == cases);

    //retreive the first element in the array
    let responseArray = response[0];

    // use Plotly pt craete a bubble chart
    let trace1 = {
      x : responseArray.otu_ids,
      y : responseArray.sample_values,
      text : responseArray.otu_labels,
      mode : "markers",
      marker : {
        size : responseArray.sample_values,
        color : responseArray.otu_ids,
        colorscale : "Portland"

      }
    }
    let data2 = [trace1];
    let layout2 = {
      title : "Belly Button Bacteria",
      xaxis : {title : "OTU ID"}
    }
    Plotly.newPlot("bubble", data2, layout2)
  })

}

// Update dashboard when new info is added
function updateData(cases){
  demographyData(cases);
  barChart(cases);
  bubbleChart(cases);
};

init()