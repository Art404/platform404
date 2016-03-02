/*eslint-disable*/
import React from 'react';

export default React.createClass({
  displayName: 'Wrap',

  propTypes: {
    children: React.PropTypes.any,
    style: React.PropTypes.object
  },

  render() {
    return (
      <div className="Carousel-wrap" style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
});
