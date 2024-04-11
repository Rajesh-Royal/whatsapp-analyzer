import { Card } from '@/components/ui/card'
import React from 'react'
import { BeatLoader } from 'react-spinners'

const Loading = () => {
  return (
    <Card className="w-[600px] h-[300px] shadow-md flex justify-center align-middle">
      <BeatLoader className="h-[25px] m-auto" />
    </Card>
  )
}

export default Loading