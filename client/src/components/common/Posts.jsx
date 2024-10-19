import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import {useQuery} from '@tanstack/react-query'
import {toast} from 'react-hot-toast'
const Posts = ({feedType}) => {
	const getPostEndPoint=()=>{
		switch(feedType){
			case "foryou": 
				return "/api/post/all"
			case "following":
				return "/api/post/following"
			default :
				return "/api/post/all"
		}
	}
	const postend = getPostEndPoint()
	const {data:posts,isLoading}= useQuery({
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
	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && posts && (
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