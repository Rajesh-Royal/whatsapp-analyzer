'use client'

import React, { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import { Modal } from '@/components/common/modal';
import ErrorImage from '@/assets/500-error.webp';
import AlertMessage from '@/components/common/AlertMessage';
import { Button } from '@/components/ui/button';

const ErrorBoundary = ({ error, reset }: {
  error: Error;
  reset: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <Modal title='Something went wrong' description='' type='dialog' isDefaultOpen hideCloseButton>
      <div className="flex items-center justify-center pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Image className="mx-auto" src={ErrorImage} alt="Workflow" width={200} height={200} />
            <AlertMessage alertMessage={error.message} alertTitle={'Error'} classNames="mt-2" variant='destructive' />
            <Button 
            disabled={loading}
            onClick={() => {
              setLoading(true);
              reset();
            }} className="mt-4 w-full">
              {loading ?
                <>
                  Retrying <LoaderCircle className='animate-spin' />
                </> :
                "Retry"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ErrorBoundary;
