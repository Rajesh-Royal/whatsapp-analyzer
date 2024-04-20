'use client'

import React from 'react'
import Header from '../dashboardLayout/header'
import { Button } from '../ui/button'
import { Heading } from '../common/heading'
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();
  return (
    <>
      <Header />
      <div className='flex h-full w-full d-flex flex-col items-center justify-center'>
        <Heading
          title='Welcome to WhatsappAnalyzer'
          description='Get insights into your chats - Now with more interesting graphs, free statistics and full PDF export, whatsapp chat file upload and more features will be added one by one, please consider to contribute.'
          className='text-center my-5 max-w-[800px]'
        />
        <Button onClick={() => {
          router.push("/dashboard");
        }}>
          Go to dashboard
        </Button>
      </div>
    </>
  )
}

export default LandingPage