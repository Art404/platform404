import React from 'react'
import {Link} from 'react-router'
import cn from 'classnames'

class Card extends React.Component {
  static displayName = 'Card';

  static propTypes = {
    'project': React.PropTypes.object,
    'layout': React.PropTypes.object
  };

  static defaultProps = {
    'project': {},
    'layout': {}
  };

  render() {
    const {layout, project} = this.props
    const cardClasses = cn('Card', {
      '--framed': layout.framed,
      '--landscape': layout.landscape,
      '--tall': layout.tall
    })

    return (
      <div className={cardClasses}>
        <Link className="Card-img-container" to={`/project/${project.url}`}>
          <span className="Card-img">
            <img src={project.thumbnail || project.media[0].url}/>
          </span>
        </Link>
        <div className="Card-flex-container">
          <span className="Card-title-container">
            <Link to={`/project/${project.url}`}>
              {project.title}
            </Link>
            <span className="paragraph-end" />
          </span>
          <span className="Card-tags-container">
          {project.tags ?
            <Link className="Card-tag" to={`/${project.tags[0]}`}>
              #{project.tags[0]}
            </Link> : null}
          </span>
          {layout.showInfo ?
            <span className="Card-info-container">
              <div dangerouslySetInnerHTML={{"__html": project.text}} />
              <span className="paragraph-end" />
            </span> : null}
        </div>
      </div>
    )
  }
}

export default Card
