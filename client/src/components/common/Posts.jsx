import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import {useQuery} from '@tanstack/react-query'
import {toast} from 'react-hot-toast'
import { useEffect } from "react";
const Posts = ({feedType, userName, userId }) => {
	const getPostEndPoint=()=>{
		switch(feedType){
			case "foryou": 
				return "/api/post/all" // tất cả bài đăng
			case "following":
				return "/api/post/following" // bài đăng của những người đang theo dõi
			case "posts":
				return `/api/post/user/${userName}`;
			case "likes":
				return `/api/post/likes/${userId}`;
			default :
				return "/api/post/all" // tất cả
		}
	}
	const postend = getPostEndPoint()
	const {data:posts,isLoading,refetch,isRefetching}= useQuery({
		queryKey:["posts"],
		queryFn: async()=>{
			try {
				const res = await fetch(postend)
				const data = await res.json()
				if(!res.ok){
					throw new Error(data.error || "Something went wrong")
				}
				return data
				
			} catch (error) {
				console.log(error)
				toast.error(error.message)
			}
		}
	})
	useEffect(()=>{
		refetch()
	},[feedType,refetch,userName])
	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
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