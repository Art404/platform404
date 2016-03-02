/*
 * This carousel based off a fork of react-picture-show
 * https://www.npmjs.com/package/react-picture-show
 */

/*eslint-disable*/
import React from 'react';
import {findDOMNode} from 'react-dom';
import Swipeable from 'react-swipeable';
import cn from 'classnames';
import {support3d, getTransition} from './utils';
import Slide from './Slide';
import Wrap from './Wrap';
import Slides from './Slides';
import Controls from './Controls';
import Dots from './Dots';


export default React.createClass({
  displayName: 'Carousel',

  propTypes: {
    animationSpeed: React.PropTypes.number,
    controls: React.PropTypes.bool,
    prependControls: React.PropTypes.bool,
    className: React.PropTypes.string,
    clickDivide: React.PropTypes.number,
    dots: React.PropTypes.bool,
    height: React.PropTypes.number,
    ratio: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.bool
    ]),
    slideBuffer: React.PropTypes.number,
    slides: React.PropTypes.array.isRequired,
    startingSlide: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      ratio: false,
      startingSlide: 0,
      animationSpeed: 1500,
      slideBuffer: 1,
      clickDivide: 0.45,
      controls: true,
      prependControls: false,
      dots: true
    };
  },

  getInitialState() {
    this.preloaded = [];
    return {
      slideIdx: this.props.startingSlide,
      panels: ['A', 'B', 'C'],
      use3dFallback: false,
      offset: 0,
      width: 0
    };
  },

  componentDidMount() {
    process.nextTick(() => {
      this.checkFallback();
      this.handleResize();
    });

    if (window.addEventListener) {
      window.addEventListener('resize', this.handleResize, false);
    }

    this.setState({
      width: findDOMNode(this.refs.wrap).offsetWidth
    })
  },

  componentWillUnmount() {
    if (window.addEventListener) {
      window.removeEventListener('resize', this.handleResize, false);
    }
  },

  checkFallback() {
    if (!support3d()) {
      this.setState({
        use3dFallback: true
      });
    }
  },

  handleResize () {
    const box = findDOMNode(this.refs.wrap).getBoundingClientRect();
    this.setState({ratio: box.width / box.height});
  },

  goToSlide (newIdx, direction, event) {
    if (this.state.idx === newIdx) return
    if (event && event.stopPropagation) event.stopPropagation();

    const {panels, slideIdx} = this.state, {animationSpeed} = this.props,
          elm = findDOMNode(this),
          width = elm.offsetWidth,
          animationTime = getTransition(width, animationSpeed);

    direction = direction || (newIdx > slideIdx ? 'right' : 'left');


    let trickPanel = null;

    if (direction === 'right' && newIdx < slideIdx) {
      trickPanel = panels.shift();
      panels.push(trickPanel);
    } else if (direction === 'left' && newIdx > slideIdx) {
      trickPanel = panels.pop();
      panels.unshift(trickPanel);
    }

    this.setState({
      slideIdx: newIdx,
      direction: direction,
      panels: panels,
      trickPanel: trickPanel,
      animationTime: animationTime
    });
  },

  next(event) {
    this.goToSlide(
      this.state.slideIdx < this.props.slides.length - 1 ?
        this.state.slideIdx + 1 : 0,
      'right', event);
  },

  previous(event) {
    this.goToSlide(this.state.slideIdx > 0 ?
      this.state.slideIdx - 1 :
      this.props.slides.length - 1,
    'left', event);
  },

  handleSlideClick(event) {
    if (this.state.swiping) return;

    const elm = findDOMNode(this),
          box = elm.getBoundingClientRect(),
          left = box.left,
          right = left + box.width,
          divide = left + ((right - left) * this.props.clickDivide);

    if (event.clientX < divide) this.previous();
    else this.next();
  },

  handleSwipe(ev, x) {
    this.setState({
      offset: 0,
      swiping: false
    });

    if (x > 0) this.next();
    else this.previous();
  },

  handleSwiping(direction, ev, x) {
    if (direction === 'left') {
      this.setState({
        swiping: true,
        offset: -x
      });
    } else {
      this.setState({
        swiping: true,
        offset: x
      });
    }
  },

  getDistance(startIdx, endIdx, direction) {
    return direction === 'left' ?
      this.getLeftDistance(startIdx, endIdx) :
      this.getRightDistance(startIdx, endIdx);
  },

  getLeftDistance(startIdx, endIdx) {
    const d = startIdx - endIdx;
    return d < 0 ? this.props.slides.length + d : d;
  },

  getRightDistance(startIdx, endIdx) {
    return this.getLeftDistance(endIdx, startIdx);
  },

  shouldLoad(slide, idx) {
    if (this.preloaded.indexOf(slide) > -1) return true;
    else if (this.getLeftDistance(this.state.slideIdx, idx) <= this.props.slideBuffer ||
               this.getRightDistance(this.state.slideIdx, idx) <= this.props.slideBuffer) {
      this.preloaded.push(slide);
      return true;
    } else return false;
  },

  render() {
    const self = this,
          {className, height, dots, ratio, slides, controls, prependControls} = this.props,
          {slideIdx, panels, swiping, offset, width} = this.state

    const slots = slides.length,
          panelWidth = slots * 100,
          ratioPad = ratio[1] / ratio[0] * 100,
          panelPosition = slideIdx * -100;

    const classes = cn(
      className,
      'Carousel', {
        '--swiping': swiping
      }
    );

    let wrapStyle = {}


    if (height && !ratio) wrapStyle.height = height
    else if (!height && ratio) wrapStyle.paddingBottom = ratioPad.toFixed(4) + '%'
    else if (height && ratio) wrapStyle = {
      minHeight: height,
      paddingBottom: ratioPad.toFixed(4) + '%'
    }

    const getPanelStyle = (idx, key) => {
      let {} = self.state

      const dragOffset = 100 / (width / offset),
            display = key === self.state.trickPanel ? 'none' : null,
            shift = (idx - 1) * panelWidth,
            left = (panelPosition + shift) + '%', // for IE
            time = swiping ? 0 : self.state.animationTime,
            tAmount = ((panelPosition + shift) / self.props.slides.length) + (dragOffset / 3),
            transform = 'translate3d(' + tAmount + '%,0,0)';

      if (self.state.use3dFallback) {
        return {
          WebkitTransitionDuration: time + 'ms',
          transitionDuration: time + 'ms',
          width: panelWidth + '%',
          left: left,
          display: display
        };
      } else {
        return {
          WebkitTransitionDuration: time + 'ms',
          transitionDuration: time + 'ms',
          width: panelWidth + '%',
          WebkitTransform: transform,
          MozTransform: transform,
          MsTransform: transform,
          transform: transform,
          display: display
        };
      }
    }

    const slideStyle = {
      width: (100 / slots) + '%'
    };

    const publicApi = {
      slides: this.props.slides,
      active: this.state.slideIdx,
      goToSlide: this.goToSlide,
      previous: this.previous,
      next: this.next,
      dots: dots
    };

    const carouselSlides = slides.map((slide, idx) => {
      if (this.shouldLoad(slide, idx)) {
        return (
          <div className={cn('Carousel-slide-wrap', {'--active': slideIdx === idx})} key={idx} style={slideStyle}>
            <Slide controls={controls} content={slide} />
          </div>
        );
      } else {
        return (
          <div className="Carousel-slide-wrap pending-slide" key={idx} style={slideStyle} />
        );
      }
    });

    return (
      <Swipeable
        onSwipingLeft={this.handleSwiping.bind(this, 'left')}
        onSwipingRight={this.handleSwiping.bind(this, 'right')}
        onSwiping={this.handleSwiping}
        onSwipedLeft={this.handleSwipe}
        onSwipedRight={this.handleSwipe}
        className={classes}>
        {controls && prependControls ? <Controls {... publicApi} /> : null}
        <Wrap style={wrapStyle} ref="wrap">
          {['A', 'B', 'C'].map(key => {
            const panelStyle = getPanelStyle(panels.indexOf(key), key);
            return <Slides key={key} style={panelStyle} slides={carouselSlides} />;
          })}
        {controls && !prependControls ? <Controls {... publicApi} /> : null}
        </Wrap>
        {dots ? <Dots {... publicApi} /> : null}
      </Swipeable>
    );
  }
});
