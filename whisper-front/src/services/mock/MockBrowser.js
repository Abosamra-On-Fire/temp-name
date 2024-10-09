import { setupWorker  } from 'msw/browser'
import { httpClient } from './MockHandlers'


export const worker = setupWorker(...httpClient);