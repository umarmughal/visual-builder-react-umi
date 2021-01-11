import React, { PureComponent } from 'react'
import { Redirect } from 'umi'

export default class Index extends PureComponent {
  render() {
    {
      /* VB:REPLACE-NEXT-LINE:ROUTER-REDIRECT */
    }
    return <Redirect to="/dashboard/alpha" />
  }
}
