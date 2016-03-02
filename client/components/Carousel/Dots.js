/*eslint-disable*/
import React from 'react';
import cn from 'classnames';


export default React.createClass({
  displayName: 'Dots',

  propTypes: {
    goToSlide: React.PropTypes.func,
    slides: React.PropTypes.array,
    active: React.PropTypes.number
  },

  render () {
    const {slides, goToSlide, active} = this.props;

    return (
      <div className='Carousel-footer'>
        <div className='Carousel-dots'>
          {slides.map( (slide, idx) => {

            const classes = cn(
              'Carousel-dot', {
                'active': active === idx
              }
            );

            return (
              <div
                onClick={() => {
                  goToSlide(idx)
                }}
                key={idx} className={classes} />
            );
         })}
        </div>
      </div>
    );
  }
});
