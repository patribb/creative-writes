import { useEffect, useState } from 'react';
import { auth, db } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import Message from '../components/Message';
import { BsTrash2Fill } from 'react-icons/bs';
import { AiFillEdit, AiOutlineLogout } from 'react-icons/ai';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  // see if user is logged
  const getData = async () => {
    if (loading) return;
    if (!user) return router.push('/auth/login');
    const collectionRef = collection(db, 'posts');
    const q = query(collectionRef, where('user', '==', user.uid));
    const onsubscribe = onSnapshot(q, (snapshop) => {
      setPosts(snapshop.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return onsubscribe;
  }

  // delete post
  const deletePost = async (id) => {
    const docRef = doc(db, 'posts', id);
    await deleteDoc(docRef);
    toast.success("Tu post ha sido eliminado 😉", {
      position: "top-center",
      autoClose: 1500,
    });
  }

  // get users data
  useEffect(() => {
    getData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])


  return (
    <div className=''>
      <h1 className='text-md text-gray-400 font-black'>Tus Posts</h1>
      <div className=''>
        {posts.map((post) => (
          <Message key={post.id} {...post}>
            <div className="flex gap-4">
              <button className='text-pink-500 flex items-center justify-center gap-2 py-2 text-sm' onClick={() => deletePost(post.id)}>
                <BsTrash2Fill className='text-2xl' />
              </button>
              <Link href={{pathname: '/post', query: post}}>
              <button className="text-teal-500 flex items-center justify-center gap-2 py-2 text-sm">
                <AiFillEdit className='text-2xl' />
              </button>
              </Link>
            </div>
          </Message>
        ))}
      </div>
      <button className='font-bold flex items-center gap-2 text-white text-sm bg-gray-800 py-2 px-4 rounded-lg my-6' onClick={() => auth.signOut()}><AiOutlineLogout />Cerrar sesión</button>
    </div>
  )
}