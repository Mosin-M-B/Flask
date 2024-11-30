import { Link } from "react-router-dom";
import { Posts } from "./Post";

export default function Feed() {
  // This would typically come from an API
  const posts = [
    {
      id: 1,
      user: "user1",
      image: "https://picsum.photos/400/400",
      likes: 42,
      caption: "Beautiful day!",
    },
    {
      id: 2,
      user: "user2",
      image: "https://picsum.photos/400/400",
      likes: 23,
      caption: "Amazing view!",
    },
    {
      id: 2,
      user: "user2",
      image: "https://picsum.photos/400/400",
      likes: 23,
      caption: "Amazing view!",
    },
    {
      id: 2,
      user: "user2",
      image: "https://picsum.photos/400/400",
      likes: 23,
      caption: "Amazing view!",
    },
    {
      id: 2,
      user: "user2",
      image: "https://picsum.photos/400/400",
      likes: 23,
      caption: "Amazing view!",
    },
    {
      id: 2,
      user: "user2",
      image: "https://picsum.photos/400/400",
      likes: 23,
      caption: "Amazing view!",
    },
  ];

  return (
    <div className="flex flex-col space-y-4">
      <div className="xl:space-y-8  ">
        {posts.map((post) => (
          <Posts key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
