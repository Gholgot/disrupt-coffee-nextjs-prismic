import React from 'react'
import { RichText } from 'prismic-reactjs'
import { linkResolver } from '../shared/utils/linkResolver'
import { apiEndpoint } from '../../prismic-configuration'
import { Helmet } from 'react-helmet'
import Link from 'next/link';

import Layout from '../components/layouts'
import Prismic from 'prismic-javascript'

const Blog = (data) => {
  if(!data) return null;

  return(
    <Layout {...data.layout}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{RichText.asText(data.blog.data.meta_title)}</title>
      </Helmet>
      <RenderBody blogHome={data} posts={data.posts} />
    </Layout>
  );
}

const RenderPosts = ({posts}) => {
  return posts.results.map((item) =>
    <div key={item.uid} className="blog-home-post-wrapper">
      <article>
        <img className="blog-home-post-image" src={item.data.image.url} alt={item.data.image.alt} />
        <p className="blog-home-post-title">
          {RichText.asText(item.data.title)}
        </p>
        <p className="blog-home-post-excerpt">
          {RichText.asText(item.data.rich_content).substring(0, 158)} …
        </p>
        <div className="blog-home-post-button-wrapper">
          <Link href="/blog/[uid]"  as={linkResolver(item)}>
            <a className="a-button">
              Read post
            </a>
          </Link>
        </div>
      </article>
    </div>
  )
}

const RenderBody = ({ blogHome, posts }) => (
  <React.Fragment>
    <div className="l-wrapper">
      <hr className="separator-hr" />
    </div>

    <section className="blog-home-section">
      <div className="blog-home-posts-wrapper">
        <RenderPosts posts={posts} />
      </div>
    </section>

    <div data-wio-id={blogHome.id}></div>
  </React.Fragment>
)

async function getHomeBlog(req) {
  const API = await Prismic.getApi(apiEndpoint, {req})
  return  API.getSingle('blog_home');
}

async function getPosts(req) {
  const API = await Prismic.getApi(apiEndpoint, {req})
  return API.query(Prismic.Predicates.at('document.type', 'blog_post'));
}

async function getLayout(req) {
  const API = await Prismic.getApi(apiEndpoint, {req})
  return API.getSingle('layout');
}

Blog.getInitialProps = async function (context) {
  const posts = await getPosts(context.req);
  const blog = await getHomeBlog(context.req);
  const layout = await getLayout(context.req)
  return {
    blog: blog,
    posts: posts,
    layout: layout
  }
}

export default Blog