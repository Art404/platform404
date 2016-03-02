/*eslint-disable*/
import React from 'react';

export default React.createClass({
  displayName: 'Slide',

  propTypes: {
    content: React.PropTypes.object,
    controls: React.PropTypes.bool,
    controlWidth: React.PropTypes.number
  },

  getDefaultProps () {
    //width of the left/right buttons
    return {
      controlWidth: 50
    };
  },

  render () {
    const {content, controls, controlWidth} = this.props
    const style = {
      width: controls ? `calc(100% - ${controlWidth * 2}px)` : `100%`
    }
    return (
      <div className='Carousel-slide' style={style}>
        {content}
      </div>
    )
  }
})
