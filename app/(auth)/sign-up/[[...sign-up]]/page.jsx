import { SignUp } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div>
      <SignUp afterSignUpUrl="/overview" />
    </div>
  );
}

export default page
