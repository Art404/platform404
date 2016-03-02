import React from 'react'
import {Link} from 'react-router'
import Carousel from '../Carousel/Carousel'

class Banner extends React.Component {
  static displayName = 'Banner';

  static propTypes = {
    'projects': React.PropTypes.array,
    'agent': React.PropTypes.string
  };

  render() {
    const {projects, agent} = this.props
    if (!projects) return null

    let slides = projects.map((project, i) => {
      const bgStyle = {
        backgroundImage: `url(${project.media[0].url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }

      return (
        <div className="Banner-card" style={bgStyle} key={i}>
          <Link to={`/project/${project.url}`} className="Banner-link" />
          <div className="Banner-title">
            {project.title}
          </div>
        </div>
      )
    })

    return (
      <div className="Banner-wrap" key={projects[0].id}>
        <div className="Banner">
          <Carousel height={agent === 'desktop' ? 290 : 212} slides={slides} prependControls={true} />
        </div>
      </div>
    )
  }
}

export default Banner
