import React from 'react'
import {Link} from 'react-router'
import Squad from './Squad'

class MenuMobile extends React.Component {
  static displayName = 'MenuMobile';

  static propTypes = {
    'params': React.PropTypes.object,
    'squad': React.PropTypes.array,
    'main': React.PropTypes.object,
    'actions': React.PropTypes.object
  };

  render() {
    const {main, squad, actions} = this.props

    return (
      <section className="MenuMobile">
        <div className="MenuMobile-links">
          {Object.keys(main.pages).map((p, i) => {
            if (p === 'home') return null
            return (
              <Link
                to={`/${main.pages[p].url}`}
                className="MenuMobile-link"
                key={i}
                onClick={actions.toggleSidebar.bind(this, false)}>
                <span className={`MenuMobile-icn ${main.pages[p].url}`} />
                {p}
              </Link>
            )
          })}
        </div>
        <Squad mobile={true} squad={squad} actions={actions} />
      </section>
    )
  }
}

export default MenuMobile
