import { SignIn } from '@clerk/nextjs';

const page = () => {
  return <SignIn forceRedirectUrl={'/dashboard'} signInUrl='/dashboard' signUpUrl='/dashboard'  afterSignOutUrl={'/'}/>
}

export default page