if (process.env.BROWSER) require('../../styles/_Main.scss')
import * as AppActions from '../../actions/AppActions'
import React, {Component, PropTypes, cloneElement} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import cn from 'classnames'
import {isEqual, merge} from 'lodash'
import assign from 'object-assign'
import Navigation from '../../components/Navigation/Navigation'
import MenuDesktop from '../../components/Menu/Menu'
import MenuMobile from '../../components/Menu/MenuMobile'

export class App extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      'fixed': false
    }

    this.checkScroll = this.checkScroll.bind(this)
  }

  static propTypes = {
    'actions': PropTypes.object.isRequired,
    'filter': PropTypes.string,
    'route': PropTypes.object.isRequired,
    'layout': PropTypes.object.isRequired,
    'app': PropTypes.object.isRequired,
    'client': PropTypes.object.isRequired
  }

  static childContextTypes = {
    'client': PropTypes.object
  }

  getChildContext () {
    return {
      'client': this.props.client
    }
  }

  componentDidMount () {
    document.addEventListener('scroll', this.checkScroll)
  }

  componentDidUpdate (prevProps) {
    if (!isEqual(prevProps.params, this.props.params)) window.scrollTo(0, 0)
  }

  checkScroll () {
    if (document.body.scrollTop >= 50 && !this.state.fixed) {
      this.setState({ 'fixed': true })
    } else if (document.body.scrollTop <= 50 && this.state.fixed) {
      this.setState({ 'fixed': false })
    }
  }

  render () {
    const {app, children, params, layout, actions, client} = this.props
    const {main, squad, db} = app
    const {agent} = client
    const {sideOpen} = layout
    const {fixed} = this.state

    const menuProps = {params, main, squad, actions}
    const navProps = assign({}, {db}, {sideOpen}, {actions}, {'client': this.props.client})
    //const navProps = {db, sideOpen, actions, client}
    const appClasses = cn('App', {
      '--fixed': fixed,
      '--mobile': agent === 'mobile',
      '--sideOpen': sideOpen
    })

    const Menu = agent === 'desktop' ? (
      <MenuDesktop {... menuProps} />
    ) : <MenuMobile {... menuProps} />

    const childProps = merge(app, {'agent': agent})

    return (
      <div className={appClasses}>
        <Navigation {... navProps} />
        {Menu}
        <div className="App-content">
          {cloneElement(children, childProps)}
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    'app': state.app,
    'client': state.client,
    'layout': state.layout
  }
}

function mapDispatchToProps (dispatch) {
  return {
    'actions': bindActionCreators(AppActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
