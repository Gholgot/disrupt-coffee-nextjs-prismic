import React from 'react'
import { RichText } from 'prismic-reactjs'
import Prismic from 'prismic-javascript'
import { linkResolver } from '../shared/utils/linkResolver'
import { apiEndpoint } from '../../prismic-configuration'
import {useRouter} from 'next/router'


import { Helmet } from 'react-helmet'
import Link from 'next/link';


import Layout from '../components/layouts'


const Preview = props => {

  return (
    <div>
    </div>
  )
}


async function getLayout() {
  const API = await Prismic.getApi(apiEndpoint)
  return API.getSingle('layout');
}


Preview.getInitialProps = async context => {
  const url = await Prismic.getApi(apiEndpoint, { req: context.req })
    .then((api) => api.previewSession(context.query.token, linkResolver, '/'))
    .then((url) => {
      context.res.writeHead(302, {Location: url,'Content-Type': 'text/html; charset=utf-8'});
      context.res.end()
      return {}
    });
}

export default Preview