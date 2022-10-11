/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { auth, db } from "../utils/firebase"
import { toast } from "react-toastify"
import Message from "../components/Message"
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore"

export default function Details() {
    const router = useRouter();
    const routeData = router.query;
    const [message, setMessage] = useState("");
    const [allMessages, setAllMessages] = useState([]);
  
    //Submit a message
    const submitMessage = async () => {
      //Check if the user is logged
      if (!auth.currentUser) return router.push("/auth/login");
  
      if (!message) {
        console.log(message);
        toast.error("No puedes enviar mensajes vacios...😅", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1500,
        });
        return;
      }
      const docRef = doc(db, "posts", routeData.id);
      await updateDoc(docRef, {
        comments: arrayUnion({
          message,
          avatar: auth.currentUser.photoURL,
          username: auth.currentUser.displayName,
          time: Timestamp.now(),
        }),
      });
      toast.success("Comentario enviado...🚀", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 500,
      });
      setMessage("");
    };
  
    //Get Comments
    const getComments = async () => {
      const docRef = doc(db, "posts", routeData.id);
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        setAllMessages(snapshot.data().comments);
      });
      return unsubscribe;
    };
  
    useEffect(() => {
      if (!router.isReady) return;
      getComments();
    }, [router.isReady]);

    return (
        <div className="">
            <Message {...routeData}></Message>
            <div className="my-4">
                <div className="flex gap-1">
                    <input
                        onChange={(e) => setMessage(e.target.value)}
                        type="text" value={message}
                        className="bg-gray-700 w-full p-2 text-white text-xs outline-none rounded-lg"
                        placeholder="Envía un mensaje...😃" />
                    <button onClick={submitMessage} className="bg-cyan-600 text-white font-medium p-2 px-4 rounded-lg text-sm">Enviar</button>
                </div>
                <div className="py-6">
                    <h2 className="text-md font-bold text-gray-600">Comentarios</h2>
                    {allMessages?.map((message) => (
                        <div className="bg-white p-4 my-4 border-2 rounded-lg" key={message?.time}>
                            <div className="flex items-center gap-2 mb-4">
                                <img
                                    className="w-10 rounded-full"
                                    src={message?.avatar}
                                    alt=""
                                />
                                <h2 className="text-xs text-gray-700 font-black">{message?.username}</h2>
                            </div>
                            <h2 className="text-sm">{message?.message}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}