import React from 'react'
import { RichText } from 'prismic-reactjs'
import Prismic from 'prismic-javascript'
import { linkResolver } from '../../shared/utils/linkResolver'
import { apiEndpoint } from '../../../prismic-configuration'

import { Helmet } from 'react-helmet'
import Link from 'next/link';
import { useRouter } from 'next/router'


import Layout from '../../components/layouts'



function handleClickAddCart(event) {
  event.preventDefault()
  window.alert(`No. Not today.\nWe're integrating the API at the moment, so coffee delivery is temporarily unavailable.`)
}

const RenderRelatedProducts = ({ related }) => {
  return related.map((item) =>
    <div key={item.uid} className="products-grid-item-wrapper">
      <img className="products-grid-item-image" src={item.product1.data.product_image.url} alt={item.product1.data.product_image.alt} />
      <p className="products-grid-item-name">
        <Link href="/products/[uid]" as={linkResolver(item.product1)}>
          <a>
            {RichText.asText(item.product1.data.product_name)}
          </a>
        </Link>
      </p>
      <p className="products-grid-item-subtitle">{RichText.asText(item.product1.data.sub_title)}</p>
    </div>
  )
}

const RenderBody = ({ product }) => (
  <React.Fragment>
    <div className="l-wrapper">
      <hr className="separator-hr" />
    </div>

    <div className="product-sections-wrapper">
      <section>
        <div className="l-wrapper">
          <div className="product-hero-inner">
            <img className="product-hero-image" src={product.data.product_image.url} alt={product.data.product_image.alt} />
            <div className="product-hero-content">
              <div className="product-hero-name">
                {RichText.render(product.data.product_name, linkResolver)}
              </div>
              <div className="product-hero-rich-content">
                {RichText.render(product.data.rich_content, linkResolver)}
              </div>
              <div className="product-hero-button-wrapper">
                <a className="a-button a-button--filled" href={product.data.button_link.url} onClick={handleClickAddCart}>
                  {RichText.asText(product.data.button_label)}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-description">
        <div className="l-wrapper">
          <div className="product-description-title">
            {RichText.render(product.title, linkResolver)}
          </div>
          <div className="product-description-content">
            {RichText.render(product.product_description, linkResolver)}
          </div>
        </div>
      </section>

      <div className="product-separator-wrapper">
        <div className="l-wrapper">
          <hr className="separator-hr" />
        </div>
      </div>

      <section>
        <div className="l-wrapper">
          <header className="products-grid-header">
            <div className="products-grid-header-title">
              {RichText.render(product.related_products_title, linkResolver)}
            </div>
          </header>
        </div>
        <div className="products-grid-items-wrapper">
          <RenderRelatedProducts related={product.data.related_products} />
        </div>
      </section>

    </div>
    <div data-wio-id={product.id}></div>
  </React.Fragment>
)

async function getLayout() {
  const API = await Prismic.getApi(apiEndpoint)
  return API.getSingle('layout');
}


async function getProduct(uid) {
  const API = await Prismic.getApi(apiEndpoint);
  return API.getByUID('product', uid, { 'fetchLinks': ['product.sub_title', 'product.product_name', 'product.product_image', 'product.uid'] });
}


const Product = props => {
  if (!props) return null;

  return (
    <Layout {...props.layout}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{RichText.asText(props.product.data.title)}</title>
      </Helmet>
      <RenderBody product={props.product} />
    </Layout>
  )
}

Product.getInitialProps = async context => {
  const layout = await getLayout();
  const product = await getProduct(context.query.uid);

  return {
    product: product,
    layout: layout
  }
}

export default Product