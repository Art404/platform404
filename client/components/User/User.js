import React from 'react'
import {isEmpty, uniq, cloneDeep, each, find} from 'lodash'
import path from 'path'

// TODO: figure out how to load these locally
const iconMap = {
  'behance': 'https://db.tt/w8HSNeZn',
  'facebook': 'https://db.tt/zeZdD9D6',
  'github': 'https://db.tt/W1LhwSsE',
  'instagram': 'https://db.tt/gFHQ2bed',
  'linkedin': 'https://db.tt/7ZZd4Gvo',
  'tumblr': 'https://db.tt/lYipN80L',
  'twitter': 'https://db.tt/6sr5ZeVl'
}

class User extends React.Component {
  static displayName = 'User'

  static propTypes = {
    'squad': React.PropTypes.array
  }

  createSquad (squad) {
    return squad.map((s, i) => (
      <div className="User-member" key={i}>
        <div className="User-member-role">{s.role}</div>
        <div className="User-email">
          <span className="User-email-icn" />
          {`${s.name}@art404.com`}
        </div>
      </div>
    ))
  }

  getUserSocial (squadMember) {
    return Object.keys(squadMember.social).map((s, i) => {
      const socialIcon = iconMap[s]
      const socialLink = squadMember.social[s]

      return (
        <a href={socialLink} key={i} className="User-social-link">
          <img src={socialIcon}/>
        </a>
      )
    })
  }

  getUserSkills (squadMember) {
    return squadMember.skills.map((s, i) => {
      return (
        <span key={i} className="User-skills-single">
          {s.toUpperCase()}
        </span>
      )
    })
  }

  getUser(squad, id) {
    id = id.toLowerCase()
    squad = squad.map((s) => {
      s.name = s.name.toLowerCase()
      return s
    })

    return find(squad, 'name', id)
  }

  render () {
    const {squad} = this.props
    const {userID} = this.props.params
    const squadMember = this.getUser(squad, userID)
    if (!squadMember) return null

    const userProfileStyles = {
      'backgroundImage': `url(${squadMember.image})`,
      'backgroundSize': 'cover',
      'backgroundPosition': 'center'
    }

    return (
      <div className="User">
        <div className="User-profile-img" style={userProfileStyles}/>
        <div className="User-blurb">
          <h3 className="User-section-title">{squadMember.fullname}</h3>
          <p className="User-bio">
            {squadMember.shortBio}
          </p>
        </div>
        <div className="User-skills">
          <div className="User-background"></div>
          <span className="User-section-title">{'SKILLS '}</span>
          {this.getUserSkills(squadMember)}
        </div>
        <div className="User-social">
          <div className="User-section-title">{'SOCIAL'}</div>
          {this.getUserSocial(squadMember)}
        </div>
        <div className="User-contact">
          <div className="User-email">
            <div className="User-section-title">{'CONTACT'}</div>
            <span className="User-email-icn" />
            {squadMember.email}
          </div>
        </div>
      </div>
    )
  }
}

export default User
