/* eslint-disable @next/next/no-img-element */
const Message = ({ children, avatar, username, description }) => {
  return (
   <div className="bg-white p-8 border-b-2  rounded-lg">
    <div className="flex items-center gap-2">
        <img src={avatar} alt={username} className="w-10 rounded-full" />
        <h2 className="text-sm text-gray-500 font-black">{username}</h2>
    </div>
    <div className="py-4">
        <p className="text-sm text-gray-600">{description}</p>
    </div>
    {children}
   </div>
  )
}

export default Message;