import React from 'react'

import { RichText } from 'prismic-reactjs'
import { linkResolver } from '../shared/utils/linkResolver'
import { apiEndpoint } from '../../prismic-configuration'
import Prismic from 'prismic-javascript'
import { CTABanner, FeaturedItems, NumberedItems, Separator, TextBlock } from '../components/slices'

import Layout from '../components/layouts'



const Home = (props) => (
  <Layout {...props.layout}>
    <RenderBody home={props.data} />    
  </Layout>
)

const RenderSlices = ({ slices }) => {
  return slices.map((slice, index) => {
    const res = (() => {
      switch (slice.slice_type) {
        case 'cta_banner': return (
          <div key={index} className="homepage-slice-wrapper">
            <CTABanner slice={slice} />
          </div>
        )

        case 'featured_items': return (
          <div key={index} className="homepage-slice-wrapper">
            <FeaturedItems slice={slice} />
          </div>
        )

        case 'big_bullet_item': return (
          <div key={index} className="homepage-slice-wrapper">
            <NumberedItems slice={slice} />
          </div>
        )

        case 'separator': return (
          <div key={index} className="homepage-slice-wrapper">
            <Separator />
          </div>
        )

        case 'text_block': return (
          <div key={index} className="homepage-slice-wrapper">
            <TextBlock slice={slice} />
          </div>
        )

        default: return
      }
    })();
    return res;
  })
}

const RenderBody = ({ home }) => (
  <React.Fragment>
    <header className="homepage-header">
      <div className="l-wrapper">
        <div className="homepage-header-title">
          {RichText.render(home.title, linkResolver)}
        </div>
      </div>
    </header>

    <section className="homepage-banner">
      <img className="homepage-banner-image" src={home.banner_image.url} alt={home.banner_image.alt} />
      <div className="homepage-banner-box-wrapper">
        <div className="homepage-banner-box">
          {RichText.render(home.banner_text, linkResolver)}
        </div>
      </div>
    </section>

    <div className="homepage-slices-wrapper">
      <RenderSlices slices={home.body} />
    </div>
  </React.Fragment>
);


async function getHomePage(req) {
  const API = await Prismic.getApi(apiEndpoint, { req })
  return API.getSingle('homepage', {'fetchLinks': ['product.sub_title', 'product.product', 'product.uid']})
}

async function getLayout(req) {
  const API = await Prismic.getApi(apiEndpoint, { req })
  return  API.getSingle('layout');
}

Home.getInitialProps = async function (context) {
  const home = await getHomePage(context.req);
  const layout = await getLayout(context.req);
  return {
    data: home.data,
    layout: layout
  }
};

export default Home;

