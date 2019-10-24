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
  return related.map(({product_related}) =>
    <div key={product_related.uid} className="products-grid-item-wrapper">
      <img className="products-grid-item-image" src={product_related.data.product.image_url} alt="Coffee picture" />
      <p className="products-grid-item-name">
        <Link href="/products/[uid]" as={linkResolver(product_related)}>
          <a>
            {product_related.data.product.title}
          </a>
        </Link>
      </p>
      <p className="products-grid-item-subtitle">{RichText.asText(product_related.data.sub_title)}</p>
    </div>
  )
}

const RenderRichDescription = (product) => {
  return <div className="product-hero-rich-content">
    <h3><i>{product.data.product.country}</i></h3>
    <ul>
      <li>
        ${product.data.product.price} per {product.data.product.weight}
      </li>
      <li>
        Taste & Notes: {product.data.product.taste}
      </li>
      <li>
        Origin: {product.data.product.origin}
      </li>
      <li>
        Varietal: {product.data.product.varietal}
      </li>
      <li>
        Process : {product.data.product.process}
      </li>
    </ul>
    <h5>Shipping</h5>
    <p>{product.data.product.shipping}</p>
  </div>
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
            <img className="product-hero-image" src={product.data.product.image_url} alt="Coffee Picture" />
            <div className="product-hero-content">
              <div className="product-hero-name">
                {RichText.render(product.data.product_name, linkResolver)}
              </div>
              <RenderRichDescription {...product}></RenderRichDescription>
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
            {RichText.render(product.data.title, linkResolver)}
          </div>
          <div className="product-description-content">
            {RichText.render(product.data.product_description, linkResolver)}
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
  return API.getByUID('product', uid, { 'fetchLinks': ['product.product', 'product.sub_title', 'product.uid'] });
}


const Product = props => {
  if (!props) return null;

  return (
    <Layout {...props.layout}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{props.product.data.product.title}</title>
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