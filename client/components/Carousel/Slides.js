/*eslint-disable*/
import React from 'react';

export default React.createClass({
  displayName: 'Slides',

  propTypes: {
    onMouseDown: React.PropTypes.func,
    slides: React.PropTypes.any,
    style: React.PropTypes.object
  },

  render() {
    const {style, slides, onMouseDown} = this.props

    return (
      <div
        className="Carousel-slides"
        style={style}
        onMouseDown={onMouseDown}>
        {slides}
      </div>
    );
  }
});
