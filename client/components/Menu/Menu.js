/*
 *
 * This is some fucking crazy code.
 * Basically a React implementation of Google's Play Store nav menu
 * https://play.google.com/store
 *
 * Lord forgive me for this.
 *
 */
import React from 'react'
import {Link} from 'react-router'
import {cloneDeep, isEmpty} from 'lodash'
import Squad from './Squad'

class Menu extends React.Component {
  static displayName = 'Menu';

  static propTypes = {
    params: React.PropTypes.object,
    squad: React.PropTypes.array,
    main: React.PropTypes.object
  };

  constructor (props) {
    super(props)
    const itemHeight = 40
    let {pages} = props.main
    let first = [], rest = [], items

    // convert pages to an array
    pages = Object.keys(pages).map((p) => (pages[p]))
    // make the "home" the first in array
    pages.forEach((p) => {
      if (!p.url) first.push(p)
      else rest.push(p)
    })

    items = first.concat(rest)

    // calculate initial styles for menu items
    items.forEach((item, i) => {
      item.opacity = 1
      item.left = 0
      item.top = i * itemHeight
    })

    // save a copy of initial state
    // to reset to later
    this.base = {
      'mouseIn': false,
      'setting': false,
      'hiddenMenu': false,
      'animating': false,
      'itemHeight': itemHeight,
      'items': items,
      'subMenu': null
    }

    this.state = cloneDeep(this.base)
  }

  componentWillReceiveProps (props) {
    const {mouseIn} = this.state
    switch (true) {
      // in case someone clicks the logo to get to home page
      case (isEmpty(props.params) && !isEmpty(this.props.params) && !mouseIn):
      // in case someone goes into a project
      case (props.params && props.params.projectID && (!this.props.params || !this.props.params.projectID)):
        this.resetMenu()
        break
    }
  }

  resetMenu () {
    // clone old base config but retain mouseIn
    let {mouseIn} = this.state
    let newState = cloneDeep(this.base)
    newState.mouseIn = mouseIn
    this.setState(newState)
  }

  showHiddenMenu (duration) {
    let {items, hiddenMenu, animating} = this.state
    // if hidden menu already visible, dont need to show it again
    if (hiddenMenu) return

    // set animating to not check for conflicts if user
    // mouses off before menu is shown
    if (!animating) this.setState({'animating': true})

    setTimeout(() => {
      // var holds whether were done animating or not
      let done = false
      items.forEach((item, i) => {
        if (i === 0) return

        // calculate left diff
        const difference = 0 - item.left
        const perTick = difference / duration * 10

        // calculate opacity diff
        const opacityDiff = 1 - item.opacity
        const opacityTick = opacityDiff / duration * 10

        item.opacity += opacityTick
        item.left += perTick
        if (item.left === 0) done = true
      })

      this.setState({ 'items': items })
      // if done, set state of hiddenMenu to true and animating to false
      if (done) this.setState({ 'hiddenMenu': true, 'animating': false })
      // else repeat loop
      else this.showHiddenMenu(duration - 10)
    }, 10)
  }

  setMouseIn () {
    // we set the mouse in to determine if route changes come
    // from clicking the menu or from links on the page
    this.setState({ 'mouseIn': true })
  }

  hideHiddenMenu (duration) {
    // this is just here because onMouseLeave of the menu has
    // dual purposes, so leveraging this function here
    this.setState({ 'mouseIn': false })
    let {items, hiddenMenu, animating, setting} = this.state
    // dont hide menu if we're setting menu link, animating a show menu
    // or if theres no sub menu yet
    if ((setting) || !hiddenMenu && !animating) return
    // if a menu is being opened but a user mouses off,
    // set hiddenMenu to be true which will stop the showHiddenMenu loop
    else if (!hiddenMenu && animating) {
      this.setState({'hiddenMenu': true})
    }

    setTimeout(() => {
      // var holds whether were done animating or not
      let done = false
      items.forEach((item, i) => {
        if (i === 0) return

        // calculate left difference
        const difference = -100 - item.left
        const perTick = difference / duration * 10

        // calculate opacity difference
        const opacityDiff = 0 - item.opacity
        const opacityTick = opacityDiff / duration * 10

        item.left += perTick
        item.opacity += opacityTick
        if (item.left == -100) done = true
      })

      this.setState({ 'items': items })
      // if done, set state of hidden menu to be false
      if (done) this.setState({ 'hiddenMenu': false })
      // else repeat loop
      else this.hideHiddenMenu(duration - 10)
    }, 10)
  }

  setSubMenu (menu, end, duration) {
    if (duration <= 0) return

    let {items, subMenu} = this.state
    // if we have no existing submenu, make new one
    if (!subMenu) subMenu = { 'opacity': 0 }

    // set the content of submenu we got from sorting
    subMenu.content = menu

    // calculate opacity animation
    const difference = end - subMenu.opacity
    const perTick = difference / duration * 10

    setTimeout(() => {
      subMenu.opacity += perTick
      this.setState({
        'subMenu': subMenu,
        'hiddenMenu': false
      })
      // if submenu fully faded in, return
      if (subMenu.opacity === end) return
      // else repeat loop
      this.setSubMenu(menu, end, duration - 10)
    }, 10)
  }

  sortMenu (itemIdx) {
    let {items, itemHeight} = this.state
    // create empty arrays to later concat as new menu
    let first = [], middle = [], last = []

    items.forEach((item, i) => {
      // if its our selected item, make it first
      if (i === itemIdx) first.push(item)
      // if its our root link (has no url) make it last
      else if (!item.url) last.push(item)
      // else push to middle
      else middle.push(item)
    })

    let newItems = first.concat(middle).concat(last)

    // re-calculate top, left, and opacity values
    newItems.forEach((newItm, k) => {
      newItm.top = k * itemHeight
      newItm.opacity = 1
      if (k > 0) {
        newItm.opacity = 0
        newItm.left = -100
      }
    })

    // wait 100ms, re-sort menu, and then fade in sub menu
    // if its our root link (no sub menu), just reset menu
    setTimeout(() => {
      this.setState({
        'items': newItems,
        'setting': false
      })
      if (items[itemIdx].url) {
        let subMenu = items[itemIdx].submenu
        this.setSubMenu(subMenu, 1, 100)
      } else this.resetMenu()
    }, 100)
  }

  setMenu (itemIdx) {
    // First function that gets fired,
    // this function animates the chosen
    // menu while fading out the non-chosen

    // check if we're "setting" yet, if not setState
    // of "setting" to be true, we check this var in case
    // mouse leaves menu but were still "setting" the menu
    const {setting} = this.state
    if (!setting) this.setState({ 'setting': true })

    const animateMenuLink = (duration) => {
      if (duration <= 0) return

      //get item + sub menu from state
      let {items, subMenu} = this.state
      let item = items[itemIdx]

      //both animations are ending at 0 (top: 0, opacity: 0)
      const end = 0
      //calculate animation increment
      const difference = end - item.top
      const perTick = difference / duration * 10

      setTimeout(() => {
        // add top to our selected item
        item.top += perTick

        // calculate opacities of other items, and
        // fade them out
        let currentOpacity
        let diff, prTck
        items.forEach((itm, k) => {
          if (k !== itemIdx) {
            currentOpacity = itm.opacity
            diff = end - itm.opacity
            prTck = diff / duration * 10
            itm.opacity += prTck
          }
        })
        // if theres a sub menu open fade it out as well
        if (subMenu) subMenu.opacity += prTck
        this.setState({
          'items': items,
          'subMenu': subMenu
        })
        // if our selected link has reached top, re-sort menu
        if (item.top === end) this.sortMenu(itemIdx)
        // else repeat loop
        else animateMenuLink(duration - 10)
      }, 10)
    }

    // recursive animateLink loop that last 150ms
    animateMenuLink(150)
  }

  render() {
    const {itemHeight, items, subMenu} = this.state
    const {squad} = this.props

    const menuStyle = {
      'height': items.length * itemHeight
    }

    return (
      <section className="Menu">
        <ul
          className="Menu-inner"
          onMouseEnter={this.setMouseIn.bind(this)}
          onMouseLeave={this.hideHiddenMenu.bind(this, 200)}
          style={menuStyle}>
          {items.map((item, i) => {

            const linkStyle = {
              'height': itemHeight,
              'left': `${item.left}%`,
              'top': item.top,
              'opacity': item.opacity
            }

            return (
              <li
                className={`Menu-item ${item.url || 'home'}`}
                style={linkStyle} key={i}
                onClick={this.setMenu.bind(this, i)}>
                <Link activeClassName="--active" className="Menu-link" to={`/${item.url || ''}`}>
                  <span className="Menu-item-icon-wrap">
                    {item.icon ? <span className="Menu-item-icon" /> : null}
                  </span>
                  <span className="Menu-label">{item.label}</span>
                </Link>
              </li>
            )
          })}
          {subMenu ?
            <div
              className={`Menu-submenu ${items[0].url}`}
              style={{
                'opacity': subMenu.opacity,
                'top': itemHeight,
                'height': `calc(100% - ${itemHeight}px)`,
                'zIndex': 5,
                'position': 'relative'
              }}>
            {subMenu.content.map((sub, i) => {
              return (
                <Link
                  style={{
                    'fontWeight': sub.bold ? '700' : 'normal'
                  }}
                  className={`Menu-submenu-link ${sub.color ? '--colored' : ''}` }
                  to={`/${items[0].url}/tagged/${sub.url}`}
                  key={i}>
                  {sub.label}
                </Link>
              )
            })}
            </div> : null}
            {subMenu ?
              <div
                onMouseEnter={this.showHiddenMenu.bind(this, 200)}
                className="Menu-return"
                style={{
                  'top': itemHeight,
                  'height': `calc(100% - ${itemHeight}px)`
                }}/> : null}
        </ul>
        <Squad squad={squad} />
      </section>
    )
  }
}

export default Menu
