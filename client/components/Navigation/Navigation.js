import React from 'react'
import Logo from '../Logo/Logo'
import {Link} from 'react-router'

const toggleSidebar = () => 'lol'

class Navigation extends React.Component {
  static displayName = 'Navigation';

  static propTypes = {
    'agent': React.PropTypes.string,
    'actions': React.PropTypes.object,
    'sideOpen': React.PropTypes.bool
  };

  closeMenu (sideOpen) {
    if (sideOpen) this.props.actions.toggleSidebar(!sideOpen)
  }

  render () {
    const {agent, sideOpen, actions} = this.props

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
        <a className="Navigation-github" href="http://github.com/art404/platform404" target="_blank">
          <div className="Navigation-github-text">
            {'View on GitHub'}
          </div>
          <div className='Navigation-github-icn' />
        </a>
      </nav>
    )
  }
}

export default Navigation
