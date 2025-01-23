import { SignUp } from '@clerk/nextjs'

const page = () => {
  return <SignUp forceRedirectUrl={'/dashboard'} signInUrl='/dashboard' afterSignOutUrl={'/'} />
}

export default page