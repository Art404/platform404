import {merge, isEmpty, cloneDeep, uniq} from 'lodash'
import BASE from './BASE'

const getBannerProjects = (banner, db) => {
  let bannerProjects = []

  if (banner.projects) {
    banner.projects.forEach((d) => {
      bannerProjects.push(db[d])
    })
  }

  if (banner.tags) {
    banner.tags.forEach((tag) => {
      Object.keys(db).forEach(d => {
        const bannerFull = bannerProjects.length === 5
        if (bannerFull) return

        const hasTags = db[d].tags && db[d].tags.indexOf(tag) > - 1
        if (hasTags) bannerProjects.push(db[d])
      })
    })
  }

  return uniq(bannerProjects)
}

const dedupeThumbnails = (db, proj, usedPics) => {
  const thumb = proj.thumbnail || proj.media[0].url
  if (usedPics.indexOf(thumb) > -1) {
    let alt = null
    proj.media.forEach((m) => {
      if (alt) return
      else if (usedPics.indexOf(m.url) === -1 && m.type !== 'gif') {
        alt = m.url
      }
    })

    if (alt) proj.thumbnail = alt
  }

  usedPics.push(proj.thumbnail || proj.media[0].url)
  return {proj, usedPics}
}

const createRows = (rows, db) => {
  let usedPics = [], newRows = []

  rows.forEach((r) => {
    let projects = [], usedProjects = []

    var waitForProjects = (cb) => {
      if (!r.content.projects) {
        cb()
        return
      }

      r.content.projects.forEach((d) => {
        if (projects.length < 8 && usedProjects.indexOf(db[d].id) === -1) {
          let dedupe = dedupeThumbnails(db, cloneDeep(db[d]), usedPics)
          let proj = dedupe.proj
          usedPics = dedupe.usedPics
          projects.push(proj)
          usedProjects.push(proj.id)
        }
      })

      cb()
    }

    waitForProjects(() => {
      if (r.content.tags) {
        r.content.tags.forEach((tag) => {
          Object.keys(db).forEach(d => {
            if (db[d].tags && db[d].tags.indexOf(tag) > -1 && usedProjects.indexOf(db[d].id) === -1) {
              if (projects.length < 8) {
                let dedupe = dedupeThumbnails(db, cloneDeep(db[d]), usedPics)
                let proj = dedupe.proj
                usedPics = dedupe.usedPics
                projects.push(proj)
                usedProjects.push(proj.id)
              }
            }
          })
        })
      }
    })

    projects = uniq(projects)
    r.content.projects = projects

    newRows.push(r)
  })

  newRows = newRows.map((nr, i) => (
    merge(nr, cloneDeep(BASE[i]))
  ))

  return newRows
}

const getLayout = (props) => {
  const {params, db, main} = props

  // HOME PAGE CONFIG
  if (!params.cat) {
    const {layout} = main.pages.home
    if (!layout) return null

    return {
      'banner': {
        'type': layout.banner.type,
        'projects': getBannerProjects(cloneDeep(layout.banner), db)
      },
      'rows': createRows(cloneDeep(layout.rows), db)
    }

  }
  // CAT / TAG CONFIG
  else if (!params.subtag) {
    let cards = [], rows = []

    Object.keys(db).forEach( d => {
      d = db[d]
      let {tags} = d, {cat} = params
      if (!tags) return

      cat = cat.toLowerCase().trim()
      if (tags.indexOf(cat) > -1) cards.push({
        'project': d,
        'layout': {
          'showInfo': false,
          'framed': false,
          'tall': false,
          'landscape': false
        }
      })
    })

    let banner = null

    if (main.pages[params.cat]) {
      const {layout} = main.pages[params.cat]
      banner = {
        'type': layout.banner.type,
        'projects': getBannerProjects(cloneDeep(layout.banner), db)
      }
    }

    return {
      'banner': banner,
      'rows': [],
      'grid': cards
    }
  }

  //SUBTAG CONFIG
  else {
    let cards = [], rows = []

    Object.keys(db).forEach( d => {
      d = db[d]
      let {tags} = d, {cat, subtag} = params
      if (!tags) return

      cat = cat.toLowerCase().trim()
      subtag = subtag.toLowerCase().trim()
      if (tags.indexOf(cat) > -1 && tags.indexOf(subtag) > -1) {
        cards.push({
          'project': d,
          'layout': {
            'showInfo': false,
            'framed': false,
            'tall': false,
            'landscape': false
          }
        })
      }
    })

    return {
      banner: null,
      rows: [],
      grid: cards
    }
  }
}

export {getLayout}
