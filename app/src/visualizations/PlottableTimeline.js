import Plottable from 'plottable/plottable.js';
import {
  min,
  max
} from 'd3';

const {
  Plot,
  Plots,
  Drawers
} = Plottable;

export class LabelDrawer extends Plottable.Drawer {
  constructor(dataset: Dataset) {
    super(dataset);
    this._svgElementName = "text";
    this._className = "label";
  }
  _drawStep(step) {
    super._drawStep(step);
    if (step.attrToAppliedProjector['data-label']) {
      this.selection()
        .text(step.attrToAppliedProjector['data-label']);
    }
  }
}

const defaultColorScale = new Plottable.Scales.Color().range(['#444']);

export default class Timeline extends Plottable.XYPlot {

  static _COLOR_KEY = 'color'
  static _X2_key = 'x2'; 

  constructor() {
    super();
    this.addClass("timebars");
    let animator = new Plottable.Animators.Easing();
    animator.startDelay(5);
    animator.stepDuration(250);
    animator.maxTotalDuration(Plot._ANIMATION_MAX_DURATION);
    this.animator(Plots.Animator.MAIN, animator);
    this.attr("opacity", 0.6);
    // this.attr("fill", new Scales.Color().range()[0]);

    this._duration = d => d.duration;
    this._color = d => '#444';
  }
  duration(accessor) {
    if (accessor) {
      this._duration = accessor;
      return this;
    }
    return this._duration;
  }
  _createDrawer(dataset) {
    return new LabelDrawer(dataset);
  }
  _createDrawer(dataset: Dataset) {
    return new Plottable.Drawers.Rectangle(dataset);
  }
  _generateDrawSteps() {
      var drawSteps = [];
      if (this._animateOnNextRender()) {
          var resetAttrToProjector = this._generateAttrToProjector();
          drawSteps.push({ attrToProjector: resetAttrToProjector, animator: this._getAnimator(Plots.Animator.RESET) });
      }
      drawSteps.push({ attrToProjector: this._generateAttrToProjector(), animator: this._getAnimator(Plots.Animator.MAIN) });
      return drawSteps;
  }
  _propertyProjectors() {
      var propertyToProjectors = super._propertyProjectors();
      var yProjector = Plottable.Plot._scaledAccessor(this.y());
      var xProjector = Plottable.Plot._scaledAccessor(this.x());
      var xAccessor = this.x().accessor;
      var durationAccessor = this.duration();
      var x2Accessor = d => new Date(xAccessor(d).getTime() + durationAccessor(d));
      // var colorProjector = Plottable.Plot._scaledAccessor(this.color());
      propertyToProjectors["transform"] = function (datum, index, dataset) {
          return "translate(" + xProjector(datum, index, dataset) + "," + (yProjector(datum, index, dataset)-5) + ")";
      };
      const xScale = this.x().scale;
      propertyToProjectors["width"] = function (datum, index, dataset) {
          const x1 = xAccessor(datum, index, dataset); 
          const x2 = x2Accessor(datum, index, dataset); 
          const width = xScale.scale(x2) - xScale.scale(x1);
          return Math.max(1, Math.abs(width));
      };
      propertyToProjectors["height"] = function (datum, index, dataset) {
          return 10;
      };
      propertyToProjectors["fill"] = function (datum, index, dataset) {
          return '#222';
      };
      propertyToProjectors["opacity"] = function (datum, index, dataset) {
          return 0.2;
      };
      return propertyToProjectors;
  }
}
