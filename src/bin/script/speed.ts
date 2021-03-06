import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

/**
 * change .npmrc file
 */
function npmrc() {
    let home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']

    let rc = readFileSync(resolve(home, '.npmrc'), 'utf8')
    let rc1 = readFileSync(resolve(home, '.npmrc1'), 'utf8')

    writeFileSync(resolve(home, '.npmrc'), rc1)
    writeFileSync(resolve(home, '.npmrc1'), rc)
}

/**
 * change nodejs version
 */
function changeNode() {
    
}

export { npmrc, changeNode }