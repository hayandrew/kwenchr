import { configure } from '@storybook/react'

const req = require.context('../client/src/components', true, /.stories.js$/)

configure(() => {
  req.keys().forEach(filename => req(filename))
}, module)
