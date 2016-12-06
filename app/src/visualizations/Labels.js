import Plottable from 'plottable/plottable.js';

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

export class XYLabel extends Plottable.XYPlot {

  static _COLOR_KEY = 'color'

  constructor() {
    super();
    this.addClass("label-scatter-plot");
    let animator = new Plottable.Animators.Easing();
    animator.startDelay(5);
    animator.stepDuration(250);
    animator.maxTotalDuration(Plot._ANIMATION_MAX_DURATION);
    this.animator(Plots.Animator.MAIN, animator);
    this.attr("opacity", 0.6);
    // this.attr("fill", new Scales.Color().range()[0]);

    this._label = d => d.label;
    this._color = d => '#444';
    this._showLabel = true;
    window.labeler = this;
  }
  toggle() {
    this._showLabel = !this._showLabel;
    this.render();
  }
  visibleEh() {
    return this._showLabel;
  }
  label(accessor) {
    if (accessor) {
      this._label = accessor;
      return this;
    }
    return this._label;
  }
  color(accessor, scale) {
    if (!accessor) {
        return this._propertyBindings.get(XYLabel._COLOR_KEY);
    }
    if (!scale) {
        scale = defaultColorScale; 
    }
    this._bindProperty(XYLabel._COLOR_KEY, accessor, scale);
    this.render();
    return this
  }
  _createDrawer(dataset) {
    return new LabelDrawer(dataset);
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
      var xProjector = Plottable.Plot._scaledAccessor(this.x());
      var yProjector = Plottable.Plot._scaledAccessor(this.y());
      // var colorProjector = Plottable.Plot._scaledAccessor(this.color());
      var labelProjector = this.label();
      propertyToProjectors["transform"] = function (datum, index, dataset) {
          return "translate(" + (xProjector(datum, index, dataset)+5) + "," + (yProjector(datum, index, dataset)-5) + ")";
      };
      propertyToProjectors["data-label"] = function (datum, index, dataset) {
          return labelProjector(datum, index, dataset);
      };
      propertyToProjectors["fill"] = (datum, index, dataset) => {
          return '#444';
          // return this._showLabel ? colorProjector(datum, index, dataset) : 'transparent';
      };
      return propertyToProjectors;
  }
}
