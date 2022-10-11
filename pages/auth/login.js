import { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../../utils/firebase';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth'

export default function Login() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  // sign In with google
  const googleProvider = new GoogleAuthProvider();
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(user) {
      router.push('/');
    } else {
      console.log('login');
    }
  }, [user])
  

  return (
    <div className="shadow-lg mt-32 p-10 text-gray-700 rounded-lg">
     <h2 className="text-2xl font-bold">Disfruta Ahora</h2>
     <div className="py-4">
        <h3 className="py-4 text-md">Elige tu modo de iniciar sesión</h3>
        <button className="text-white bg-gray-700 w-full font-medium rounded-lg flex items-center justify-center align-middle p-4 gap-2" onClick={GoogleLogin}>
        <FcGoogle className='text-2xl' /> Entrar con Google</button>
     </div>
    </div>
  )
}