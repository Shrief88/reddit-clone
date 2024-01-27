import { NavLink } from "react-router-dom"

interface PostProps {
  subredditName: string
}

const Post = (props: PostProps) => {
  return (
    <div className="rounded-md bg-background shadow">
      <div className="px-6 py-4 flex justify-between">
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {/* {props.subredditName ? (
              <NavLink to={"/r/" + props.subredditName}></NavLink>
            )} */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post