import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";
import {useQuery} from '@tanstack/react-query'
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "./LoadingSpinner";
const RightPanel = () => {
	const {data:suggestedUsers,isLoading} = useQuery({
		queryKey:["suggestedUsers"],
		queryFn:async()=>{
			try {
				const res = await fetch('/api/user/suggested')
				const data = await res.json()
				if(!res.ok){
					throw new Error(data.message || "Something went wrong")
				}
				return data
			} catch (error) {
				throw new Error(error.message)
			}
		}
	})
	const {follow,isPending} = useFollow()
	if(suggestedUsers?.length === 0) return <div className="md:w64 w-0"></div>
	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className=' p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Gợi ý theo dõi ?</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedUsers?.map((user) => (
							<Link
								to={`/profile/${user.userName}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImage || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user.userName}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault()
											follow(user?._id) // truyền id người dùng vào hàm hook 
										}}
									>
										{
											isPending ? <LoadingSpinner size="sm"/> : "Follow"
										}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;