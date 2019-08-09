import archiver from 'archiver'
import {createWriteStream} from 'fs-extra'
import {Z_BEST_COMPRESSION} from 'zlib'

const zipFile = './dist/index.zip'

const archiveAssets = async () => {
  const archiveStream = createWriteStream(zipFile)
  const archive = archiver('zip', {zlib: {level: Z_BEST_COMPRESSION}})
  archive.pipe(archiveStream)
  return new Promise<string> ((accept, reject) => {
    archiveStream.on('close', () => {
      accept()
    })
    archiveStream.on('error', (error) => {
      reject(error)
    })
    archive.on('warning', (error) => {
      if (error.code !== 'ENOENT') {
        reject(error)
      }
    })
    archive.file('./dist/index.js', {name: 'index.js'})
    archive.file('./dist/index.map', {name: 'index.map'})
    archive.finalize()
  })
}

(async () => {
  try {
    console.log('creating asset archive...')
    await archiveAssets()
    console.log('done.')
  } catch (error) {
    console.error('failed to archive assets.')
    console.error(error)
    process.exit(500)
  }
})()
