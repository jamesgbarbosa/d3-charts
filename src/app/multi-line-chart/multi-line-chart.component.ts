import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import * as D3 from "d3";

@Component({
    selector: 'multi-line-chart',
    templateUrl: './multi-line-chart.component.html',
    styleUrls: ['./multi-line-chart.component.scss'],
})
export class MultiLineChartComponent implements OnInit, AfterViewInit {
    @ViewChild('lineChart') lineChart: ElementRef;
    @ViewChild('tooltip') tooltip: ElementRef;
    @ViewChild('tooltipXValue') tooltipXValue: ElementRef;
    @ViewChild('tooltipYValue') tooltipYValue: ElementRef;


    id = ""
    @Input() data: any = [];
    @Input() variableWidth = 1000;
    @Input() variableHeight = 400;
    @Output() onSelectFilter = new EventEmitter<any>();

    @Input() xProp = 'x';
    @Input() yProp = 'y';
    @Input() yAxisLabel = "";
    @Input() xTooltipLabel = "";
    @Input() yTooltipLabel = "";
    @Input() TooltipLabel = '';
    @Input() isCurve = true;

    // Settings
    // Graph
    margin = {
        top: 30, right: 30, bottom: 70, left: 50
    }

    //Legend
    legendWidth = 12;
    legendHeight = 12;
    legendFontSize = 12;
    legendFont = ""

    // Tooltip
    tooltipAlignment = "center"

    // Line
    lineSettings = {
        default: {
            strokeWidth: 3,
            hoverStrokeWidth: 4
        }
    }

    //Points
    pointRadius = 6;

    //Component Data
    width = 0;
    height = 0;
    masterData: any;
    svg: any;

    constructor() { }

    get d3() {
        return D3;
    }

    get chart() {
        return this.d3.select(this.lineChart.nativeElement);
    }

    get colors() {
        return this.d3.schemeCategory10;
    }

    refreshGraph() {
        if (this.lineChart) {
            this.chart.select("svg").remove();
            this.renderGraph();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['variableWidth'] || changes['data']) {
            if (changes['data']) {
                this.data.forEach((it: any, index: any) => {
                    it?.values.sort((a: any, b: any) => { a[this.xProp] - b[this.xProp] })
                    it['uniqueId'] = `data_${index}`
                })
            }
            this.masterData = this.data;
        }

        if (changes['data']) {
            this.initGraphExtraProps();
        }

        this.refreshGraph();
    }

    ngOnInit(): void {
        this.initGraphExtraProps();
        this.refreshGraph();
    }

    ngAfterViewInit(): void {
        this.masterData = this.data;
        this.refreshGraph();
    }

    initColorAssignmentByType() {
        this.data.forEach((it: any, index: any) => {
            it['color'] = this.colors[index]
        })
    }

    initGraphExtraProps() {
        this.data.forEach((it: any, i: any) => {
            it['isDisplayed'] = true;
            it?.values?.forEach((it: any) => {
                it['index'] = i;
                it['id'] = `data_${i}`
            })
        })
    }

    renderGraph() {
        this.width = this.variableWidth - this.margin.left - this.margin.right;
        this.height = this.variableHeight - this.margin.top - this.margin.bottom;
        this.initColorAssignmentByType();
        let d3 = this.d3;
        var x = d3.scaleLinear().domain(d3.extent(this.getAllXData())).range([0, this.width]); // change 0 to 20 will put space between y and x axis 
        // Little buffer/spacing to display negative values above x-axis 
        let yMin = this.d3.min(this.getAllYData()) >= 0 ? 0 : (+d3.min(this.getAllYData())) - (Math.abs(+d3.max(this.getAllYData()) * 0.05))
        var y = d3.scaleLinear().domain([yMin, +d3.max(this.getAllYData()) * 1.1]).range([this.height, 0]);

        this.svg = this.chart.append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + 25)
            .on("pointerenter pointermove", (event: any) => {

            })
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")

        // Add the X Axis
        this.svg.append("g")
            .attr("transform", "translate(0" + "," + this.height + ")")
            .attr("class", "x-axis")
            .attr("x", "20")
            .call(d3.axisBottom(x).tickValues(this._initXTickValues()).tickSize(0).ticks(7).tickPadding(7).tickFormat((n: any) => { return n.toString() }))

        this.svg.append("g")
            .attr("transform", "translate(-10, 0)")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y).tickSize(0).ticks(7).tickPadding(7).tickFormat((n: any) => { return this._kFormatter(n) + "" }))

        if (this.data?.length > 0) {
            this.drawLines(x, y);
            this.appendYLabel();
            this.initMiscGraphSettings();
        } else {
            console.log(`data value -> ${this.data}`)
        }
    }

    _positionTooltip(xPos: any, yPos: any) {
        let tooltip = this.tooltipElement;
        let tooltipClientRect = this.tooltip.nativeElement.getBoundingClientRect()
        if (xPos > tooltipClientRect.width / 2) {
            // Check if right have space
            if ((xPos + tooltipClientRect.width / 2) > this.lineChart.nativeElement.getBoundingClientRect().width) {
                this._initTooltip("right", tooltip, xPos, yPos)
                this.tooltipAlignment = "right";
            } else {
                this._initTooltip("center", tooltip, xPos, yPos)
                this.tooltipAlignment = "center";
            }
        } else {
            // Check if left have space
            if ((xPos - tooltipClientRect.width / 2 + this.margin.left) < 0) {
                this._initTooltip("left", tooltip, xPos, yPos)
                this.tooltipAlignment = "left";
            } else {
                this._initTooltip("center", tooltip, xPos, yPos)
                this.tooltipAlignment = "center";
            }
        }
    }

    _initTooltip(tooltipAlignment: any, tooltip: any, xPos: any, yPos: any) {
        let tooltipClientRect = this.tooltip.nativeElement.getBoundingClientRect();
        if (tooltipAlignment == "center") {
            tooltip.style('left', (xPos + this.margin.left - (tooltipClientRect.width / 2) + 40) + "px")
            tooltip.style('top', (yPos + this.margin.top - (tooltipClientRect.height + 20)) + "px")

        }

        if (tooltipAlignment == "left") {
            tooltip.style('left', (xPos + this.margin.left - (tooltipClientRect.width * 0.1)) + "px")
            tooltip.style('top', (yPos + this.margin.top - (tooltipClientRect.height + 20)) + "px")

        }

        if (tooltipAlignment == "right") {
            tooltip.style('left', (xPos + this.margin.left - (tooltipClientRect.width * 0.9)) + "px")
            tooltip.style('top', (yPos + this.margin.top - (tooltipClientRect.height + 20)) + "px")

        }
    }

    _initTooltipValues(d: any, index: any) {
        this.tooltipXValue.nativeElement.textContent = d[this.xProp];
        this.tooltipYValue.nativeElement.textContent = d[this.yProp];
    }

    get tooltipElement() {
        return this.d3.select(this.tooltip.nativeElement)
    }

    drawLines(x: any, y: any) {
        let line: any;
        if (this.isCurve) {
            line = this.d3.line().curve(this.d3.curveMonotoneX)
        } else {
            line = this.d3.line();
        }
        line.x((d: any) => {
            return x(d[this.xProp])
        }).y((d: any) => {
            return y(d[this.yProp])
        })

        this.data.forEach((it: any, i: any) => {
            let lineGroup = this.svg.append("g")
                .attr("class", `linegroup linegroup-${i}`)
                .data([it?.values])

                lineGroup
                .on("mouseover", (event: any, d: any) => {
                    this._positionHoveredLineToTopLayer(d)
                })
                .on("mouseout", () => {
                    this._revertLinesOrder();
                })

                let linePath = lineGroup.append("path")
                    .attr("class", `linepath linepath-${i}`)
                    .style("fill", "none")
                    .attr("d", line)
                    .attr("stroke-width", this.getLineStrokeWidth(it, false))
                    .style("stroke", (d: any) => {
                        return it.color;
                    })

                let offsetPath = lineGroup.append("path")
                    .attr("class", `offsetPath offsetpath-${i}`)
                    .style("fill", "none")
                    .attr("d", line)
                    .style("opacity", 0)
                    .attr("stroke-width", "1.2rem")
                    .style("stroke", (d: any) => {
                        return "black"
                    })
                    .on("mouseover", (event: any) => {
                        this._initLineStrokeOnMouseOver(i, it);
                        let points = this.chart.selectAll(`g.${it.uniqueId}`).select("circle");
                        points.style("opacity", 100)
                    })

                    .on("mouseout", () => {
                        this._initLineStrokeOnMouseOut(i, it);
                        let points = this.chart.selectAll(`g.${it.uniqueId}`).select("circle");
                        points.style("opacity", 0)
                    })

                    let lineData = it.values;
                    lineData.forEach((d: any, index: any) => {
                        let points_class = it.uniqueId;
                        let pointGroup = lineGroup.append("g")
                            .data([it.values])
                            .attr("class", `focus ${points_class}`)
                            .attr("transform", `translate(${x(d[this.xProp])}, ${y(d[this.yProp])})`)

                        let point = pointGroup.append("circle")
                            .attr("r", this.pointRadius)
                            .style("fill", (d: any) => {
                                return it.color;
                            })
                            .style("opacity", 0)
                            .on("mouseover", (event: any) => {
                                this._initTooltipValues(d, index);
                                let tooltip = this.tooltipElement;
                                tooltip.style("display", null)
                                tooltip.style("opacity", 100)
                                point.style("opacity", 100)
                                let xPos = x(d[this.xProp])
                                let yPos = y(d[this.yProp])
                                this._positionTooltip(xPos, yPos);
                                this._initLineStrokeOnMouseOver(i, it);
                            })
                            .on("mouseout", () => {
                                this.tooltipElement.style("display", "none");
                                point.style("opacity", 0)
                                this._initLineStrokeOnMouseOut(i, it);
                            })
                    })

            this.toggleHidePointsInLine(it?.isDisplayed, i);
            this.toggleHideLine(it?.isDisplayed, i);

            const totalLength = linePath.node().getTotalLength();
            var dashing = "6, 4"
            var dashLength = dashing.split(/[\s,]/).map(a => +a || 0).reduce((a, b) => { return a + b })
            var dashCount = Math.ceil(totalLength / dashLength)
            var newDashes = new Array(dashCount).join(dashing + " ")
            var dashArray = newDashes + "0, " + totalLength;

            linePath
                .attr("stroke-dashoffset", totalLength)
                .attr("stroke-dasharray", it['isDashed'] ? dashArray : totalLength + " " + totalLength)
                .transition()
                .duration(1200)
                .ease(this.d3.easeLinear)
                .attr("stroke-dashoffset", 0)
        })

    }

    getLineStrokeWidth(lineData: any, isHover = false) {
        return (isHover ? this.lineSettings?.default?.hoverStrokeWidth : this.lineSettings?.default?.strokeWidth) + 'px'
    }

    getLineGroupByIndex(lineIndex: any) {
        return this.chart.select(`.linegroup-${lineIndex}`);
    }

    getLinePathByIndex(lineIndex: any) {
        return this.chart.select(`.linepath-${lineIndex}`)
    }

    getOffsetLineByIndex(lineIndex: any) {
        return this.chart.select(`.offsetPath-${lineIndex}`)
    }

    selectAllPoints() {
        return this.svg.selectAll(".focus")
    }

    selectLinePointsByIndex(lineIndex: any) {
        return this.svg.selectAll(`g.data_${lineIndex}`);
    }

    _initLineStrokeOnMouseOver(lineIndex: any, data: any) {
        this.getLinePathByIndex(lineIndex)
            .attr("stroke-width", this.getLineStrokeWidth(data, true))
    }

    _initLineStrokeOnMouseOut(lineIndex: any, data: any) {
        this.getLinePathByIndex(lineIndex)
            .attr("stroke-width", this.getLineStrokeWidth(data, false))
    }

    _positionHoveredLineToTopLayer(event: any) {
        let id = event[0]?.index;
        const sortFunction = (path: any) => {
            this.chart.selectAll(path).sort((a: any, b: any) => {
                if (a[0]?.index == id) { return 1 }
                if (b[0]?.index == id) { return -1 }
                return a[0]?.index < b[0]?.index ? -1 : 1;
            })
        }
        sortFunction("g.linegroup")
    }

    _revertLinesOrder() {
        const sortFunction = (path: any) => {
            this.chart.selectAll(path).sort((a: any, b: any) => {
                return a[0]?.index - b[0]?.index;
            })
        }
        sortFunction("g.linegroup")
    }

    initMiscGraphSettings() {
        this.svg.selectAll(".x-axis path")
            .style("stroke", "#CBC9C9")

        this.svg.selectAll(".y-axis path")
            .style("stroke", "#CBC9C9")

        this.svg.append("line")
            .attr("x1", "-10")
            .attr("y1", "300.5")
            .attr("x2", "0.5")
            .attr("y2", "300.5")
            .attr("stroke-width", "1")
            .style("stroke", "#CBC9C9")

    }

    onClickLegend(d: any, i: any) {
        let isActive = this.data[i].isDisplayed = !this.data[i]?.isDisplayed;
        this.toggleHideLine(isActive, i);
        this.toggleHidePointsInLine(isActive, i)
    }

    toggleHideLine(toggle: any, lineIndex: any) {
        return this.getLineGroupByIndex(lineIndex)
            .attr("display", toggle ? null : "none")
    }

    toggleHidePointsInLine(toggle: any, lineIndex: any) {
        this.selectLinePointsByIndex(lineIndex).attr("display", toggle ? null : "none")
    }


    onMouseOverLegend(d: any, i: any) {
        this._initLineStrokeOnMouseOver(i, d);
    }

    onMouseOutLegend(d: any, i: any) {
        this._initLineStrokeOnMouseOut(i, d);
    }

    appendYLabel() {
        this.svg.append("text")
            .attr("class", "y-label")
            .attr("x", -35)
            .attr("y", -15)
            .attr("font-size", 12)
            .attr("font-weight", 700)
            .attr("font-family", this.legendFont)
            .text(this.yAxisLabel)
    }

    getAllXData() {
        return this.data.map((it: any) => { return it.values.map((it: any) => { return it[this.xProp] }) })

            .reduce((list: any, it: any) => [...list, ...it]) as Number[]
    }

    getAllYData() {
        return this.data.map((it: any) => it.values.map((it: any) => it[this.yProp])).reduce((list: any, it: any) => [...list, ...it]) as Number[]
    }

    _initXTickValues() {
        return [...new Set(this.getAllXData())].sort();
    }

    _kFormatter(num: any) {
        return Math.abs(num) > 999 ? Math.sign(num) * +((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num);
    }
}