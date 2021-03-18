import readdirp from 'readdirp'
import path from 'path'

export async function listPages (filePath) {
  const files = await readdirp.promise(filePath, { fileFilter: '*.yaml' })
  function _createPath(i) {
    let p = '/' + (path.dirname(i.path) === '.' ? '' : path.dirname(i.path))
    return path.basename(i.path) === 'index.yaml' 
      ? p 
      : p + i.path.substr(0, i.path.length - 5)
  }
  return files.filter(i => i.basename !== '404.yaml').map(i => {
    return { 
      path: _createPath(i), 
      data: i.path
    }
  })
}

  //   {path: "/", data: "index.yaml"},
  //   {path: "/galerie", data: "galerie.yaml"},
  //   {path: "/vstupne", data: "vstupne.yaml"},
  //   {path: "/organizace", data: "organizace.yaml"},
  //   {path: "/program", data: "program.yaml"},
  //   {path: "/navstevnici", data: "navstevnici.yaml"}
  //    ]