import React from 'react'
import { RichText } from 'prismic-reactjs'
import { linkResolver } from '../shared/utils/linkResolver'
import { apiEndpoint } from '../../prismic-configuration'
import { Helmet } from 'react-helmet'
import Link from 'next/link';

import Layout from '../components/layouts'
import Prismic from 'prismic-javascript'


const Products = (data) => {
  if (!data) return null;

  return (
    <Layout {...data.layout}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{RichText.asText(data.homeProduct.data.title)}</title>
      </Helmet>
      <RenderBody productHome={data.homeProduct} products={data.products.results} />
    </Layout>
  );
}

const RenderProductList = ({products}) => {
  return products.map((item) =>
    <div key={item.uid} className="products-grid-item-wrapper">
      <Link href="/products/[uid]" as={linkResolver(item)}>
        <a>
          <img className="products-grid-item-image" src={item.data.product.image_url} alt='Coffee picture' />
          <p className="products-grid-item-name">
            {item.data.product.title}
          </p>
        </a>
      </Link>
      <p className="products-grid-item-subtitle">{RichText.asText(item.data.sub_title)}</p>
    </div>
  )
}

const RenderBody = ({ productHome, products }) => (
  <React.Fragment>
    <div className="l-wrapper">
      <hr className="separator-hr" />
    </div>

    <section className="products-section">
      <div className="l-wrapper">
        <header className="products-grid-header">
          <div className="products-grid-header-title">
            {RichText.render(productHome.title, linkResolver)}
          </div>
        </header>
      </div>
      <div className="products-grid-items-wrapper">
        <RenderProductList products={products} />
      </div>
    </section>

    <div data-wio-id={productHome.id}>{}</div>
  </React.Fragment>
)

async function getLayout(req) {
  const API = await Prismic.getApi(apiEndpoint, req)
  return API.getSingle('layout');
}

async function getProducts(req) {
const API = await Prismic.getApi(apiEndpoint, req);
  return API.query(Prismic.Predicates.at('document.type', 'product'));
}

async function getHomeProduct(req) {
  const API = await Prismic.getApi(apiEndpoint, req)
  return API.getSingle('products');
}

Products.getInitialProps = async function (context) {
  const productList = await getProducts(context.req);
  const homeProduct = await getHomeProduct(conrtext.req);
  const layout = await getLayout(conrtext.req)
  return {
    homeProduct: homeProduct,
    products: productList,
    layout: layout
  }
}

export default Products

