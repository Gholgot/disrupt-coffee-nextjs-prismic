module.exports = {
    apiEndpoint: 'https://prismic-nextjs-sample2tony.cdn.prismic.io/api/v2',
    // accessToken: '###########',
    hrefResolver: (doc) => {
      if (doc.type === 'product') {
        return `/product?uid=${doc.uid}`
      }
      return '/'
    }
  };
