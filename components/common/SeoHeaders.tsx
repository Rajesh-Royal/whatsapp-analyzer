import Head from 'next/head'
import React from 'react'

const SeoHeaders = () => {
  return (
    <Head>
        <meta name="theme-color" content="#daf8c4" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        <title>Chatistics - Open Source WhatsApp Analytics and Insights</title>
        <meta
          name="title"
          content="Chatistics - Open Source WhatsApp Analytics and Insights"
        />
        <meta
          name="description"
          content="Get insights and analysis of your WhatsApp chats, share it with your friends, 100% Secure and Open Source"
        />
        <meta
          name="google-site-verification"
          content="WCfe4Q5dRptivznL2ZrsKuMPN48PTz9whNqtF6MhHOk"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://chatistics.vercel.app/" />
        <meta
          property="og:title"
          content="Chatistics - Open Source WhatsApp Analytics and Insights"
        />
        <meta
          property="og:description"
          content="Get insights and analysis of your WhatsApp chats, share it with your friends, 100% Secure and Open Source"
        />
        <meta property="og:image" content="" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://chatistics.vercel.app/" />
        <meta
          property="twitter:title"
          content="Chatistics - Open Source WhatsApp Analytics and Insights"
        />
        <meta
          property="twitter:description"
          content="Get insights and analysis of your WhatsApp chats, share it with your friends, 100% Secure and Open Source"
        />
        <meta property="twitter:image" content="" />
      </Head>
  )
}

export default SeoHeaders