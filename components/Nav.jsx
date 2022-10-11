import Link from "next/link"
import { auth } from '../utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth';

const Nav = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center py-10">
        <Link href='/'>
          <button className="font-black text-2xl text-gray-500">Creative Minds</button>
        </Link>
        <ul className="flex items-center gap-10">
        {!user && (
            <Link href='/auth/login'>
            <a className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium">Disfruta</a>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link href='/post'>
            <button className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-md text-sm">Escribir</button>
            </Link>
            <Link href='/dashboard'>
              <img className="w-12 rounded-full cursor-pointer" src={user?.photoURL} alt={user?.displayName} />
            </Link>
          </div>
        )}
        </ul>
    </nav>
  )
}

export default Nav