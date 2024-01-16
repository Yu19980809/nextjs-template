import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'

const Home = async () => {
  const {userId} = auth()
  console.log('userId')

  if (!userId) {
    redirect('/sign-in')
  } else {
    redirect('/product')
  }
}

export default Home
