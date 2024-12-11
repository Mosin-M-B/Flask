import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Posts } from "./Post";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch the random images from the Flask API
    const fetchRandomImages = async () => {
      try {
        const response = await fetch("http://localhost:5000/random-images");
        const data = await response.json();
        if (data.posts) {
          setPosts(data.posts);
        }
        
      } catch (error) {
        console.error("Error fetching random images:", error);
      }
    };
    
    fetchRandomImages();
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <div className="xl:space-y-8">
        {posts.map((post) => (

          <Posts key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
