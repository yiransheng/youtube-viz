import Plottable from 'plottable/plottable'

    var xScale = new Plottable.Scales.Category();
    var yScale = new Plottable.Scales.Linear();
    var data = [{ x: 1, y: 1 }, { x: 2, y: 3 }, { x: 3, y: 2 },
        { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 6, y: 5 }];

    var plot = new Plottable.Plots.Scatter()
        .addDataset(new Plottable.Dataset(data))
        .x(function(d) { return d.x; }, xScale)
        .y(function(d) { return d.y; }, yScale)
        .renderTo("svg#example");

    window.addEventListener("resize", function() {
        plot.redraw();
    });