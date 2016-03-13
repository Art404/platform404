import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import cn from 'classnames'

class Card extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  static contextTypes = {
    'client': PropTypes.object
  }

  static displayName = 'Card'

  static propTypes = {
    'project': PropTypes.object,
    'layout': PropTypes.object
  }

  static defaultProps = {
    'project': {},
    'layout': {}
  }

  checkSeen (project, client) {
    if (!client.cookie || !project) return false
    else return client.cookie.projectsSeen.indexOf(project.id) > -1
  }

  render() {
    const {layout, project} = this.props
    const {client} = this.context
    const seen = this.checkSeen(project, client)
    const cardClasses = cn('Card', {
      '--framed': layout.framed,
      '--landscape': layout.landscape,
      '--tall': layout.tall,
      '--seen': seen
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
