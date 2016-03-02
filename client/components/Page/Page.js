import React from 'react'
import Banner from '../Banner/Banner'
import Row from '../Row/Row'
import {getLayout} from './layouts'
import Grid from '../Grid/Grid'

class Page extends React.Component {
  static displayName = 'Page';

  static propTypes = {
    'main': React.PropTypes.object,
    'agent': React.PropTypes.string,
    'params': React.PropTypes.object,
    'db': React.PropTypes.object
  };

  render () {
    const {main, agent, params} = this.props
    if (!main) return null

    const layout = getLayout(this.props)
    if (!layout) return null

    return (
      <div className="Page">
        {layout.banner ?
          <Banner {... layout.banner} agent={agent} /> : null}
        {layout.rows.map((r, i) => (
          <Row config={r} key={i} agent={agent}/>
        ))}
        {layout.grid ?
          <Grid cards={layout.grid} /> : null}
      </div>
    )
  }
}

export default Page
