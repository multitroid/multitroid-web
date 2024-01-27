import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import loadable from '@loadable/component'

import 'bootstrap-dark-5/dist/css/bootstrap-night.min.css'
import './style/styles.scss'
import './style/spinner.css'

const urlSearchParams = new URLSearchParams(window.location.search)
export const OBSERVER = urlSearchParams.has('commentator') || urlSearchParams.has('observer')
export const DELAY = urlSearchParams.has('delay') ? parseInt(urlSearchParams.get('delay')) : 0

export const commitHash = __COMMIT_HASH__ //eslint-disable-line no-undef

const Connect = loadable(() => import('./components/connect/Connect'))
const SessionWrapper = loadable(() => import('./components/session/SessionWrapper'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <Connect/>,
  },
  {
    path: '/:sessionId',
    element: <SessionWrapper/>,
  },
])

createRoot(document.getElementById('maincontent')).render(
  <RouterProvider router={router}/>
)
