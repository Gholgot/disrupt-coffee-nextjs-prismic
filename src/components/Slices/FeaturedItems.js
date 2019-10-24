import React from 'react'
import { Link as PrismicLink, RichText } from 'prismic-reactjs'
import { linkResolver } from '../../shared/utils/linkResolver'
import Link from 'next/link';


function renderProducts(slice) {
  return slice.items.map((item, index) =>
    <div key={item.link_to_product.data.uid} className="products-grid-item-wrapper">
      <img className="products-grid-item-image" src={item.link_to_product.data.product.image_url} />
      <p className="products-grid-item-name">
        <Link href="/products/[uid]" as={linkResolver(item.link_to_product)}>
          <a>
            {item.link_to_product.data.product.title}
          </a>
        </Link>
      </p>
      <p className="products-grid-item-subtitle">{RichText.asText(item.link_to_product.data.sub_title)}</p>
    </div>
  );
}
export default ({ slice }) =>
  <section>
    <div className="l-wrapper">
      <header className="products-grid-header">
        <div className="products-grid-header-title">
          {RichText.render(slice.primary.section_title, linkResolver)}
        </div>
        <div className="products-grid-header-button-wrapper">
          <Link href={linkResolver(slice.primary.button_link)}>
            <a className="a-button">
              {RichText.asText(slice.primary.button_label)}
            </a>
          </Link>
        </div>
      </header>
    </div>
    <div className="products-grid-items-wrapper">
      {renderProducts(slice)}
    </div>
  </section>
