import { Img } from 'react-image';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { Spinner } from '@material-tailwind/react';

export const Posts = ({ user, image, likes, caption }) =>{
  return (
    <div className="bg-white xl:border xl:border-gray-200 xl:rounded-md sm:w-full">
      <div className="p-4 flex items-center">
        <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
        <span className="font-semibold">{user}</span>
      </div>
      <Img src={image} alt="Post" width={400} height={400} className="w-full h-[500px] flex justify-center items-center " loader={<Spinner/>}/>
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-4">
            <Heart className="w-6 h-6" />
            <MessageCircle className="w-6 h-6" />
            <Send className="w-6 h-6" />
          </div>
          <Bookmark className="w-6 h-6" />
        </div>
        <p className="font-semibold mb-1">{likes} likes</p>
        <p>
          <span className="font-semibold mr-2">{user}</span>
          {caption}
        </p>
      </div>
    </div>
  );
}
