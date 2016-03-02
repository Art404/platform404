import React from 'react'
import {findDOMNode} from 'react-dom'
import cn from 'classnames'
import Card from '../Card/Card'
import {isEmpty} from 'lodash'
import {Link} from 'react-router'

class Row extends React.Component {
  static displayName = 'Row';

  static propTypes = {
    'config': React.PropTypes.object,
    'agent': React.PropTypes.string
  };

  static defaultProps = {
    'config': {}
  };

  constructor () {
    super()
    this.state = {
      'width': null
    }
  }

  createRows (projects, layout, width, agent) {
    let cardWidth = 170

    if (agent === 'desktop') {
      const isLandscape = layout.cardLayout && layout.cardLayout.landscape
      if (isLandscape) cardWidth = cardWidth * 2
      let maxCards = Math.floor((width + 10) / cardWidth)
      // min amount of cards
      if (maxCards < 4 && !isLandscape ) maxCards = 4
      if (maxCards < 3 && isLandscape) maxCards = 3

      projects = projects.slice(0, maxCards)
      if (projects.length < maxCards) cardWidth = (width + 10) / projects.length
    }

    return projects.map((project, i) => {
      return <Card project={project} layout={layout.cardLayout} key={i}/>
    })
  }

  componentDidMount () {
    this.setState({
      'width': this.getWidth(findDOMNode(this.refs.cardWrap))
    })
  }

  getWidth (element) {
    var styles = window.getComputedStyle(element)
    var padding = parseFloat(styles.paddingLeft) +
                  parseFloat(styles.paddingRight)

    return element.clientWidth - padding
  }

  getSubtitleTags(tags) {
    if (!tags) return null
    return tags.map((t, i) => (
      <Link key={i} to={`/${t}`}>
        {t}{i === tags.length - 1 ? '' : ','}
      </Link>
    ))
  }

  render() {
    const {agent} = this.props
    const {layout, content} = this.props.config, {width} = this.state
    if (!content || isEmpty(content.projects)) return null

    const rowBG = {
      'backgroundImage': `url(${layout.bgImage})`,
      'backgroundSize': 'cover',
      'backgroundPosition': 'center'
    }

    const rowClasses = cn('Row', {
      '--hasBG': layout.bgImage
    })

    return (
      <article className={rowClasses}>
        <div className="Row-contents">
          {content.title ?
            <div className="Row-header">
              <ul>
                <li className="Row-header-title">{content.title}</li>
                <li className="Row-header-subtitle">{this.getSubtitleTags(content.subtitle_tags)}</li>
              </ul>
              {agent === 'desktop' ?
                <Link className="Row-header-link" to={`/${content.url}`}>
                  {'see more'}
                </Link> :null}
            </div> : null}
          <div className="Row-cards" ref="cardWrap">
            <div className="Row-cards-list">
              {width ? this.createRows(content.projects, layout, width, agent) : null}
            </div>

              {layout.bgImage && width ? <div className="Row-banner" style={rowBG} /> : null}
          </div>
        </div>
      </article>
    )
  }
}

export default Row
