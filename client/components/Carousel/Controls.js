/*eslint-disable*/
import React from 'react';

export default React.createClass({
  displayName: 'Controls',

  propTypes: {
    previous: React.PropTypes.func,
    next: React.PropTypes.func,
    slides: React.PropTypes.array,
    active: React.PropTypes.number,
    fullscreen: React.PropTypes.bool
  },

  render () {
    return (
      <div className="Carousel-controls">
        <div className="Carousel-control-wrap prev">
          <div className="Carousel-control-wrap-inner">
            <span
              className='Carousel-control prev'
              onMouseDown={this.props.previous} />
          </div>
        </div>
        <div className="Carousel-control-wrap next">
          <div className="Carousel-control-wrap-inner">
            <span
              className='Carousel-control next'
              onMouseDown={this.props.next} />
          </div>
        </div>
      </div>
    );
  }
});
