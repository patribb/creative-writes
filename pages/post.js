import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Post() {
    const [post, setPost] = useState({ description: '' });
    const router = useRouter();
    const [user, loading] = useAuthState(auth);

    const routeData = router.query;

    // submit post
    const submitPost = async (e) => {
        e.preventDefault();

        // run checks for description
        if (!post.description) {
            toast.error("Por favor, añade una descripción 😅", {
                position: "top-center",
                autoClose: 1500,
            });
            return;
        }
        if (post.description.length > 300) {
            toast.error("Tu descripción es demasiado extensa... 😅", {
                position: "top-center",
                autoClose: 1500,
            });
            return;
        }

        if (post?.hasOwnProperty("id")) {
            const docRef = doc(db, "posts", post.id);
            const updatedPost = { ...post, timestamp: serverTimestamp() };
            await updateDoc(docRef, updatedPost);
            toast.success("Post actualizado 😃", {
                position: "top-center",
                autoClose: 1500,
            });
            return router.push('/');
        } else {
            // make a new post
            const collectionRef = collection(db, 'posts');
            await addDoc(collectionRef, {
                ...post,
                timestamp: serverTimestamp(),
                user: user.uid,
                avatar: user.photoURL,
                username: user.displayName
            });
            setPost({ description: '' });
            toast.success("Post creado 🚀", {
                position: "top-center",
                autoClose: 1500,
            });
            return router.push('/');
        }
    }

    // check our user
    const checkUser = async () => {
        if (loading) return;
        if (!user) useRouter.push('/auth/login');
        if (routeData.id) {
            setPost({ description: routeData.description, id: routeData.id })
        }
    }

    useEffect(() => {
        checkUser();
    }, [user, loading])


    return (
        <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
            <form onSubmit={submitPost}>
                <h1 className="text-xl text-gray-700 font-black">
                    {post.hasOwnProperty('id') ? 'Editar Post' : 'Crear Post'}
                </h1>
                <div className="py-2">
                    <h3 className="text-sm font-bold text-gray-600 py-2">Descripción</h3>
                    <textarea value={post.description} className="bg-gray-600 outline-none h-48 w-full text-white rounded-lg p-2 text-sm" onChange={(e) => setPost({ ...post, description: e.target.value })} />
                    <p className={`text-xs text-cyan-600 ${post.description.length > 300 ? 'text-red-500' : ''} `}>{post?.description?.length}/300</p>
                </div>
                <button type='submit' className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm">{post.hasOwnProperty('id') ? 'Actualizar' : 'Enviar'}</button>
            </form>
        </div>
    )
}