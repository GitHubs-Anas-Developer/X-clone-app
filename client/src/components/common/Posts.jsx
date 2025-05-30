import React from 'react';
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../constant/url";

const Posts = ({ feedType, userName, userId }) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return `${baseUrl}/api/posts/all`;
      case "following":
        return `${baseUrl}/api/posts/following`;
      case "posts":
        return `${baseUrl}/api/posts/user/${userName}`;
      case "likes":
        return `${baseUrl}/api/posts/likes/${userId}`;
      default:
        return `${baseUrl}/api/posts/all`;
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const {
    data: posts,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["posts", feedType, userName, userId], // Include dependencies in query key
    queryFn: async () => {
      const res = await fetch(POST_ENDPOINT, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch posts");
      }

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (error) {
    return <p className="text-center my-4">Error: {error.message}</p>;
  }

  return (
    <>
      {(isLoading || isFetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isFetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isFetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;