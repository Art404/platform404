import React from 'react'
import Card from '../Card/Card'

class Grid extends React.Component {
  static displayName = 'Grid';

  static propTypes = {
    'cards': React.PropTypes.array
  };

  render() {
    const {cards} = this.props
    if (!cards) return null

    return (
      <article className="Grid">
        {cards.map((c, i) => (
          <Card {... c} key={i}/>
        ))}
      </article>
    )
  }
}

export default Grid
