import React, { useEffect, useState } from 'react'
import pink from '../../assets/Discover/pink.jpg'
import magglass from '../../assets/Discover/magglass.jpg'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Loader2 from '../../utilities/Loader2'




function Discover() {
  const [loading, setLoading] = useState(true);


  // Enable the plugin
  dayjs.extend(relativeTime)
  function getShortTime(createdAt) {
    const now = dayjs();
    const then = dayjs(createdAt);
    const mins = now.diff(then, 'minute');
    const hrs = now.diff(then, 'hour');
    const days = now.diff(then, 'day');

    if (mins < 60) return `${mins}m`;
    if (hrs < 24) return `${hrs}h`;
    return `${days}d`;
  }

  const [posts, setPosts] = useState(null)
  const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/post",
    withCredentials: true,
  });

  const getPost = async () => {
    try {
      setLoading(true);
      const response = await api.get('/');
      setPosts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };




















  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const userApi = axios.create({
    baseURL: "http://localhost:8000/api/v1/users",
    withCredentials: true,
  });

  const fetchUser = async () => {
    try {
      const res = await userApi.get('/user-homepage');
      setUser(res.data.data);
      setUserId(res.data.data._id); // Save userId separately
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };










  useEffect(() => {
    getPost()
    fetchUser();
  }, [])

  const [heading, setHeading] = useState('');
  const [image, setImage] = useState(null);
  const [creatingPost, setCreatingPost] = useState(false);

  // Add state
  const [content, setContent] = useState(''); // for optional body

  // Updated handlePost function to include content
  const handlePost = async () => {
    if (!heading && !image && !content) return;

    const formData = new FormData();
    if (heading) formData.append("heading", heading);
    if (image) formData.append("image", image);
    if (content) formData.append("content", content); // add optional content

    try {
      setCreatingPost(true);
      await api.post('/create', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setHeading('');
      setImage(null);
      setContent('');
      getPost(); // Refresh posts
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setCreatingPost(false);
    }
  };

  const handleLikeToggle = async (postId, isLiked) => {
  try {
    const url = isLiked
      ? `/${postId}/unlike`
      : `/${postId}/like`;

    await api.post(url);

    // Optimistically update the local state
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              likes: isLiked
                ? post.likes.filter((id) => id !== userId)
                : [...post.likes, userId],
            }
          : post
      )
    );
  } catch (error) {
    console.error('Error toggling like:', error);
  }
};







  return (
    <>
      {loading && <Loader2 />}
      <div className="relative w-full h-auto">
        <div
          className="w-screen h-auto"
          style={{
            backgroundImage: `url(${pink})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="fixed top-0 left-0 w-full h-full bg-black/60 z-0" />
          <div className="w-full h-auto relative z-10">
            <div className="h-20 w-full flex justify-between items-center text-white !px-10">
              <div className="font-bold font-sans text-2xl">Discover</div>
              {user ? (
                <img
                  src={user.profilePicture}
                  alt="profile"
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <div className="size-10 bg-amber-700 rounded-full animate-pulse" />
              )}

            </div>
            <div className="h-auto flex items-center justify-center w-full !px-3">
              <div className="w-full h-auto !p-3 max-w-[700px]"
                style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                  backdropFilter: 'blur(2px)',
                  WebkitBackdropFilter: 'blur(2px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              >
                <div
                  className="w-full h-auto flex items-center justify-between !mb-3"
                >
                  <div className="flex justify-center items-center gap-3">
                    {user ? (
                      <>
                        <img
                          src={user.profilePicture}
                          alt="profile"
                          className="size-14 rounded-full object-cover"
                        />
                        <div className="font-sans text-xl text-white lg:text-base">{user.fullName}</div>
                      </>
                    ) : (
                      <>
                        <div className="size-14 bg-amber-700 rounded-full animate-pulse" />
                        <div className="font-sans text-xl text-white lg:text-base">Loading...</div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={handlePost}
                    disabled={creatingPost}
                    className="text-sm text-white w-24 h-10 flex items-center justify-center rounded-full disabled:opacity-50"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                    }}
                  >
                    {creatingPost ? 'Posting...' : 'Post'}
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    placeholder="Enter heading..."
                    className="w-full h-10 !px-4 text-white placeholder-white/60 focus:outline-none rounded-lg"
                    style={{
                      background: 'rgba(10, 10, 10, 0.7)',
                      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                      backdropFilter: 'blur(6px)',
                      WebkitBackdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />

                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add something more (optional)..."
                    rows={3}
                    className="w-full !px-4 py-2 text-white placeholder-white/60 focus:outline-none rounded-lg resize-none"
                    style={{
                      background: 'rgba(10, 10, 10, 0.7)',
                      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                      backdropFilter: 'blur(6px)',
                      WebkitBackdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />

                  {image ? (
                    <div className="text-white flex items-center gap-2">
                      <span>{image.name}</span>
                      <button
                        onClick={() => setImage(null)}
                        className="text-red-400 hover:text-red-600 text-xl font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label
                      className="cursor-pointer text-sm text-white w-32 h-10 flex items-center justify-center rounded-full"
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                      }}
                    >
                      Attach Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        hidden
                      />
                    </label>
                  )}
                </div>


              </div>
            </div>
          </div>


          {/* POST */}
          <div className="w-full flex justify-center items-center">
            <div className="w-full max-w-[700px] h-auto relative z-10 flex flex-col items-center !mt-4 gap-5">
              {/* EACH */}
              {posts === null ? (
                <div className="text-white col-span-full text-center">Loading posts...</div>
              ) : posts.length === 0 ? (
                <div className="text-white col-span-full text-center">No posts available yet.</div>
              ) : (
                posts.map((post) => {
                  const isLiked = post.likes.includes(userId);
                  return (
                    <div key={post._id} className="w-[90%] h-auto">
                      <div
                        className="w-full h-auto flex items-center justify-between !mb-3"
                      >
                        <div className="flex justify-center items-center gap-3">
                          <div className="size-10 flex justify-center items-center rounded-full">
                            <img src={post.user.profilePicture} alt="" className='rounded-full w-full h-full' />
                          </div>
                          <div className="font-sans text-base text-white lg:text-base">{post.user.fullName}</div>
                        </div>

                        <div
                          className="font-sans text-sm text-neutral-300 w-20 h-10 flex items-center justify-center !rounded-full"
                        >
                          {getShortTime(post.createdAt)}
                        </div>
                      </div>
                      <div className="flex w-full gap-2 !pl-[20px]">
                        <div className="h-auto w-0.5 bg-neutral-200"></div>
                        <div className="">
                          <div className="text-white text-2xl">{post.heading}</div>
                          <div className="max-w-full max-h-250px">
                            <img src={post.image} alt="" className='w-full' />
                          </div>
                          <div className="text-neutral-100 text-base">{post.content}
                          </div>
                          <div className="text-white w-full flex gap-3 !mt-3 !mb-3 items-center">
                            <div
                              className="cursor-pointer transition-transform duration-200 active:scale-95"
                              onClick={() => handleLikeToggle(post._id, isLiked)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="30"
                                height="30"
                                fill={isLiked ? "#f87171" : "none"}
                                stroke="#f87171"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`transition-all duration-300 ${isLiked ? 'scale-110' : 'scale-100'
                                  }`}
                              >
                                <path d="M10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 13.0348 16.4106 17.858 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z" />
                              </svg>
                            </div>
                            <div className="text-white">{post.likes.length}</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )
                }))}
            </div>
          </div >
        </div>
      </div>
    </>
  )
}

export default Discover
