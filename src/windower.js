import React from 'react';
import PropTypes from 'prop-types';


const propsValidators = require('helpers/props_validators');

const BUFFER_SIZE = 1800; // pixels, roughly 50 typical table rows
const MIN_ANIMATE_INTERVAL = 66; // ms, about 15fps

class VisibilityCalculator {

  constructor(opts = {}) {
    if (!opts.reactWrapperInstance) throw new Error('Missing argument reactWrapperInstance');
    if (!opts.reactWrapperInstance.triggerUpdate) throw new Error('Wrapper needs method triggerUpdate');

    // Use window height for simplicity and do lookup once here to reduce browser layout thrashing
    this._containerHeight = window.innerHeight;

    // Options
    this._reactWrapperInstance = opts.reactWrapperInstance;
    this._scrollingContainer = null;
    this._referenceItem = null;
    this._referenceItemDimensions = null;

    // Animation data
    this._lastAnimated = 0;
    this._updateInProgress = false;

    this._triggerAnimationReq();
  }

  /**
   * @param {HTMLElement} scrollingContainer
   */
  addScrollingContainer(scrollingContainer) {
    if (!scrollingContainer) {
      throw new Error('Missing argument scrollingContainer');
    }

    if (this._scrollingContainer === scrollingContainer) {
      return;
    }

    this._scrollingContainer = scrollingContainer;
    delete this._lastScrollTop;
  }

  /**
   * @param {HTMLElement} item Refrence child item for sampling per-child heights
   */
  addRefItem(item) {
    if (!item) {
      throw new Error('Missing argument item');
    }
    this._referenceItem = item;

    // Reset item dimensions cache
    this._referenceItemDimensions = null;
  }

  destroy() {
    window.cancelAnimationFrame(this._animationReq);
    delete this._reactWrapperInstance;
    delete this._scrollingContainer;
    delete this._referenceItem;
  }

  /**
   * Public fn. Uses reference child and scrolling el to determine which indices are within/near viewport
   * NOTE - requires that every child item is of equal height
   *
   * @return {Object} obj of key start, end. Values are floats
   */
  getDisplayableIndexRange() {
    if (!this._scrollingContainer || !this._referenceItem) return {};

    const scrollPosition = this._calcScrollTop();

    const perItemHeight = this.getReferenceItemDimensions().height;

    return {
      start: (scrollPosition - BUFFER_SIZE) / perItemHeight,
      end  : (scrollPosition + this._containerHeight + BUFFER_SIZE) / perItemHeight
    };
  }

  /**
   * Public fn. Retrieve and/or store ref item's calculated dimensions.
   * Relies on `getComputedStyle` because margin info is not part of HTMLElement properties
   * @return {Object} Currently only has single `height` prop. Empty if no known dimensions.
   */
  getReferenceItemDimensions() {
    if (!this._referenceItem) return {};
    if (this._referenceItemDimensions) return this._referenceItemDimensions;

    const itemStyle = window.getComputedStyle(this._referenceItem);
    const perItemHeight = this._referenceItem.offsetHeight +
      parseFloat(itemStyle.marginTop) +
      parseFloat(itemStyle.marginBottom);

    const referenceItemDimensions = {
      height: perItemHeight
    };

    this._referenceItemDimensions = referenceItemDimensions;
    return referenceItemDimensions;
  }

  _triggerAnimationReq() {
    this._animationReq = window.requestAnimationFrame(this._requestAnimationFrame);
  }

  _requestAnimationFrame = (timestampMs) => {

    // NOTE - no extra work should be done while update in progress. Avoids write-read-repeat layout thrashing
    //        Order of early returns will matter here!

    // Early return if controller setup is not done or if wrapper update is not finished
    const isSetupIncomplete = !this._reactWrapperInstance || !this._scrollingContainer || !this._referenceItem;
    if (this._updateInProgress || isSetupIncomplete) {
      return this._triggerAnimationReq();
    }

    if (timestampMs - this._lastAnimated < MIN_ANIMATE_INTERVAL) return this._triggerAnimationReq();

    const scrollTop = this._calcScrollTop();

    // Prevent extra work when too little time has passed or when scroll data has not changed
    if (Math.abs(scrollTop - this._lastScrollTop) < BUFFER_SIZE / 2) {
      return this._triggerAnimationReq();
    }

    this._lastAnimated = timestampMs;
    this._lastScrollTop = scrollTop;
    this._updateInProgress = true;
    this._reactWrapperInstance.triggerUpdate(() => {
      // Remove flag so that next animation frame will update wrapper instance
      // Only remove in this callback because the re-render process may take a while
      this._updateInProgress = false;
    });
    this._triggerAnimationReq();
  }

  /**
   * Get scrolling positioning information off of either an inner HTMLElement or the document
   * @return {number}
   */
  _calcScrollTop() {
    let containerScrollTop;
    if (this._scrollingContainer === document.documentElement) {
      containerScrollTop = window.pageYOffset || document.documentElement.scrollTop; // multi source of truth for compat
    } else {
      containerScrollTop = this._scrollingContainer.scrollTop;
    }

    return containerScrollTop;
  }

}

export default class VisibilityAwareContainer extends React.Component {

  static propTypes = {
    children                   : propsValidators.childrenType,
    WrapperComponent           : PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    scrollingContainerClassName: PropTypes.string,

    alwaysRenderChildByIdx: PropTypes.objectOf(PropTypes.bool.isRequired),

    VoidSpace: PropTypes.func
  }

  static defaultProps = {
    alwaysRenderChildByIdx: {},

    VoidSpace: ({ idx, style }) => <div key={ `void-${idx}` } style={ style } />
  }

  constructor(props) {
    super(props);

    // Setup React-agnostic viewport visibility calculator
    this._visibilityCalculator = new VisibilityCalculator({
      reactWrapperInstance: this
    });
  }

  shouldComponentUpdate() {
    return true; // Must always update
  }

  componentWillUnmount() {
    this._visibilityCalculator.destroy();
    this._visibilityCalculator = null;
  }

  triggerUpdate(callback = _.noop) {
    this.forceUpdate(callback);
  }

  _registerReferenceItem = (instance) => {
    if (!instance || !this._visibilityCalculator) {
      return;
    }

    const instanceDOMRef = instance.getDOMRef ? instance.getDOMRef() : instance;
    if (instanceDOMRef instanceof React.Component) {
      throw new Error('React instance is missing method to get DOM ref');
    }

    const scrollingContainer = _.find(
      document.getElementsByClassName(this.props.scrollingContainerClassName),
      el => el.contains(instanceDOMRef)
    );

    this._visibilityCalculator.addRefItem(instanceDOMRef);
    this._visibilityCalculator.addScrollingContainer(scrollingContainer || document.documentElement);
  }

  _getChild = (child, opts = {}) => {
    const { idx, voidHeight } = opts;
    if (voidHeight) {
      return this.props.VoidSpace({ idx, style: { height: voidHeight } });
    }

    // First child will have its original ref callback re-wrapped to pass on child DOM node to visilibty controller
    const refCb = (idx !== 0) ?
      child.ref :
      (instance) => {
        if (_.isFunction(child.ref)) child.ref(instance);
        if (!instance) return;

        this._registerReferenceItem(instance);
      };

    return React.cloneElement(child, { ref: refCb });
  }

  _getChildren() {
    if (!React.Children.count(this.props.children)) return null;

    const displayableIndexRange = this._visibilityCalculator.getDisplayableIndexRange();
    const { height: perChildHeight = 0 } = this._visibilityCalculator.getReferenceItemDimensions();

    let alwaysRenderIdxLookup = { 0: true }; // Only render 1st child by default

    // Only allow remainding render els once height from first child has been determined
    if (perChildHeight) {
      alwaysRenderIdxLookup = _.merge(alwaysRenderIdxLookup, this.props.alwaysRenderChildByIdx);

      // Only fill the lookup if index has previously been rendered, which means there is a valid perChildHeight
      alwaysRenderIdxLookup = _.range(Math.ceil(displayableIndexRange.start), Math.ceil(displayableIndexRange.end))
        .reduce((acc, val) => {
          acc[val] = true;
          return acc;
        }, alwaysRenderIdxLookup);
    }


    // Return transformed children array consisting of a number of normally rendered elements,
    // with the space between consecutively normal els taken up by monolithic Void elements that maintain vertical space
    let voidHeight = 0;
    return React.Children.toArray(this.props.children).reduce((acc, child, idx, childrenArray) => {
      const isChildNotWanted = !alwaysRenderIdxLookup[idx];
      let isVoidGrowing = idx < childrenArray.length - 1;
      let realChild;

      if (isChildNotWanted) {
        // throw into the void
        voidHeight += perChildHeight;
      } else {
        isVoidGrowing = false;
        realChild = this._getChild(child, { idx });
      }

      // First add completed void, if one exists
      if (voidHeight && !isVoidGrowing) {
        acc.push(this._getChild(null, { idx, voidHeight }));
        voidHeight = 0;
      }

      // Then add any real child created during this iteration
      if (realChild) {
        acc.push(realChild);
      }

      return acc;
    }, []);

  }

  render() {
    const WrapperComponent = this.props.WrapperComponent;

    return (<WrapperComponent className="visibility-aware-container">
      { this._getChildren() }
    </WrapperComponent>);
  }

}