import * as cp from 'child_process'
import { unlink, writeFile } from 'fs'
import { join, resolve, dirname } from 'path'
import { SnippetCase } from '../types'
import { rejects } from 'assert'
import { validateObject } from '../utils'



export const buildCase = (a: SnippetCase, interval?: number): string=> 
  `
    const { hrtime } = require( 'process' )

    let result = 0

    ;(() => {

      const start = hrtime.bigint()

      const sample = ()=> {

        ${a.content}
        
      }

      for (let i = 0; i<${interval}; i++) sample()

      const end = hrtime.bigint()

      result = parseFloat(end - start)/1e6

    })();

    console.log(result)`


export const generateCase = async (a: SnippetCase, subjectPath: string, index: number, interval?: number): Promise<SnippetCase> => {

  try {

    return new Promise((resolve, reject)=> {
      
      const path: string = join(subjectPath, `${a.name || index}.case.js`)
      const buildContent: string = buildCase(a, interval)

      // 1. write test-case
      return writeFile(path, buildContent, (err: NodeJS.ErrnoException | null)=> 
        err ? 
          reject(err):

          // 2. shell: execute test-case
          // exec( `node ${path}`, { async: !0 }, (_: any, stdout: any, err: any)=> 
          cp.exec( `node ${path}`, (_: any, stdout: any, err: any)=> 
          
            !validateObject(err) ? 
            
              // 3. delete test-case after successful execution
              unlink(path, ()=>  

                // 4. resolve after deletion
                resolve({ ...a, stdout: parseFloat(stdout) })):
                reject(err)))

      })

  } catch(e) {

    return new Promise((_, reject)=> 
      reject(e))

  }

}