import archiver from 'archiver'
import {createWriteStream} from 'fs-extra'
import {Z_BEST_COMPRESSION} from 'zlib'
import {copy} from 'fs-extra'
import {exec} from 'child_process'
import {default as rimraf} from 'rimraf'

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
    archive.directory('./pack', false)
    archive.finalize()
  })
}

(async () => {
  try {
    console.log('installing prod to pack...')
    await copy('package.json', './pack/package.json')
    await copy('dist/lambda', 'pack/lambda')
    await new Promise((accept) => rimraf('pack/tasks', () => accept()))
    await new Promise ((accept, reject) => exec('npm install --production', {cwd: './pack'}, (error) => error ? reject() : accept()))
    console.log('creating asset archive...')
    await archiveAssets()
    console.log('done.')
  } catch (error) {
    console.error('failed to archive assets.')
    console.error(error)
    process.exit(500)
  }
})()
