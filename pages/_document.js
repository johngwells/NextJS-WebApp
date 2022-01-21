import Document, { Html, Head, Main, NextScript } from 'next/document';

import Footer from './footer';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link
            rel='preload'
            href='/fonts/Lora-Italic.ttf'
            as='font'
            crossOrigin='anonymous'
          ></link>
        </Head>
        <body>
          <Main />
          <Footer />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
