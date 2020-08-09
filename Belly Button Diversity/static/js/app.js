d3.json("samples.json").then((data) => {
    console.log(data)
    var sampleDataset = data.samples;
    var namesDataset = data.names;

    //Create a dropdown menu with all IDs

    var dropdown = d3.select("#selDataset");
    var option;
    for (var i = 0; i < namesDataset.length; i++) {
        option = dropdown.append("option").text(namesDataset[i])
    };

    showGraphs(namesDataset[0]);
    showPanel(namesDataset[0]);
})

function showPanel(name) {
    d3.json("samples.json").then((data) => {
        var metaset = d3.select("#sample-metadata")
        var panelb = metaset.selectAll("p")
        panelb.remove();

        var intname = parseInt(name);
        var sample = data.metadata.filter(m => m.id === intname)[0];
        
        Object.entries(sample).forEach(function([key, value]) {
            var cell = metaset.append("p");
            cell.text(`${key}: ${value}`)
        })
    })
}

// Make change function so all graphics change to your selected "ID" from the dropdown
function optionChanged() {
    var name = d3.select("#selDataset").node().value;
    console.log(name);
    showGraphs(name);
    showPanel(name);
}
//When an ID is selected, filter all data to show graphs relating to that ID
function showGraphs(name) {
    d3.json("samples.json").then((data) => {
        var sample = data.samples.filter(obj => obj.id ==name)[0];

        var barinfo = [
            {
                y: sample.otu_ids.slice(0,10).reverse().map(obj => `OTU ${obj}`),
                x: sample.sample_values.slice(0,10).reverse(),
                text: sample.otu_labels.slice(0,10).reverse(),
                orientation: "h",
                type:"bar"
            }
        ]

        var layout = {
            title: `Cultures in Subject ${name}`
        }

        Plotly.newPlot("bar", barinfo, layout);

        var bubbleinfo = [{
            x: sample.otu_ids,
            y: sample.sample_values,
            mode: "markers",
            marker: {
                size: sample.sample_values,
                color: sample.otu_ids,
                colorscale: "Spectral"
            },
            text: sample.otu_labels
        
        }];
        
        // Make Layout for Bubble Plot
        var layout2 = {
            xaxis:{title: "OTU ID"},
            height: 700,
            width: 1200
        };
        
        // Make the bubble plot 
        Plotly.newPlot("bubble", bubbleinfo, layout2); 
    })
}