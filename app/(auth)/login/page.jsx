
import { requireUnAuth } from '@/lib/auth-utils'
import { LoginForm } from '@/modules/auth/components/login-form'


import React from 'react'

const Page = async () => {
  await requireUnAuth()
  return (

    <LoginForm />

  )
}

export default Page