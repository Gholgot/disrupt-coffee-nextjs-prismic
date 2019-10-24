import React from 'react'
import { RichText } from 'prismic-reactjs'
import Prismic from 'prismic-javascript'
import { linkResolver } from '../../shared/utils/linkResolver'
import { apiEndpoint } from '../../../prismic-configuration'

import { Helmet } from 'react-helmet'
import Link from 'next/link';
import { useRouter } from 'next/router'


import Layout from '../../components/layouts'

const RenderBody = ({ blogPost }) => (
  <React.Fragment>
    <div className="l-wrapper">
      <hr className="separator-hr" />
    </div>

    <article className="blog-post-article">
      <div className="blog-post-inner">
        <div className="blog-post-image-wrapper">
          <img className="blog-post-image" src={blogPost.data.image.url} alt={blogPost.data.image.alt}/>
        </div>
        <div className="blog-post-title">
          {RichText.render(blogPost.data.title, linkResolver)}
        </div>
        <div className="blog-post-rich-content">
          {RichText.render(blogPost.data.rich_content, linkResolver)}
        </div>
        <div className="blog-post-author-wrapper">
          {blogPost.data.author && blogPost.data.author.picture
            ? <img className="blog-post-author-picture" src={blogPost.data.author.picture.url} alt={blogPost.data.author.picture.alt} />
            : ''
          }
          <div>
            {blogPost.data.author && blogPost.data.author.name
              ? <p className="blog-post-author-name">{RichText.asText(blogPost.author.name)}</p>
              : ''
            }
            {blogPost.data.author && blogPost.data.author.bio
              ? <p className="blog-post-author-bio">{RichText.asText(blogPost.author.bio)}</p>
              : ''
            }
          </div>
        </div>
      </div>
    </article>

    <div data-wio-id={blogPost.id}></div>
  </React.Fragment>
)

const BlogPost = props => {
  if(!props) return null;

  return(
    <Layout {...props.layout}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{RichText.asText(props.blogPost.data.title)}</title>
      </Helmet>
      <RenderBody blogPost={props.blogPost} />
    </Layout>
  )
}

async function getLayout() {
  const API = await Prismic.getApi(apiEndpoint)
  return API.getSingle('layout');
}


async function getBlogPost(uid) {
  const API = await Prismic.getApi(apiEndpoint);
  return API.getByUID('blog_post', uid);
}

BlogPost.getInitialProps = async context => {
  const layout = await getLayout();
  const product = await getBlogPost(context.query.uid);

  return {
    blogPost: product,
    layout: layout
  }
}

export default BlogPost;