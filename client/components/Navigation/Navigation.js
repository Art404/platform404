import React, {PropTypes} from 'react'
import Logo from '../Logo/Logo'
import {Link} from 'react-router'
import {size} from 'lodash'

class Navigation extends React.Component {
  static displayName = 'Navigation'

  static propTypes = {
    'actions': PropTypes.object,
    'sideOpen': PropTypes.bool,
    'client': PropTypes.object,
    'db': PropTypes.object
  }

  constructor (props) {
    super(props)
  }

  closeMenu (sideOpen) {
    if (sideOpen) this.props.actions.toggleSidebar(!sideOpen)
  }

  render () {
    console.log('RENDERIN NAV ! ', this.props)
    const {sideOpen, actions, db, client} = this.props
    const {agent, cookie} = client
    const {projectsSeen} = cookie
    console.log(this.props.client.cookie.projectsSeen)
    console.log(projectsSeen)
    const hasProjects = agent === 'desktop' && projectsSeen && projectsSeen.length

    return (
      <nav className="Navigation">
        {agent === 'mobile' ?
          <div
            className="Navigation-menu-btn"
            onClick={actions.toggleSidebar.bind(this, !sideOpen)} /> : null}
        <div className="Navigation-logo">
          <Link to="/" onClick={this.closeMenu.bind(this, sideOpen)}>
            <Logo />
          </Link>
        </div>
        {hasProjects ?
          <div className="Navigation-projects-seen">
            <span className="Navigation-projects-btn">
              {`PROJECTS SEEN: ${projectsSeen.length} / ${size(db)}`}
            </span>
          </div> : null}
        <a className="Navigation-github" href="http://github.com/art404/platform404" target="_blank">
          <div className='Navigation-github-icn' />
        </a>
      </nav>
    )
  }
}

export default Navigation
