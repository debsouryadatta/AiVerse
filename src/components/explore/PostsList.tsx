'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  BarChart2,
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ExplorePost } from '@/types'
import { formatDistance, format, isWithinInterval, subHours, subYears } from 'date-fns';
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { 
  addLikeAction, 
  removeLikeAction, 
  addToBookmarkAction, 
  removeFromBookmarkAction,
  checkLikeBookmarkStatusAction
} from '@/app/(inner_routes)/post/[...slug]/actions'
import { ShareDialog } from "@/components/post/ShareDialog"

export default function PostsList({posts}: {posts: ExplorePost[]}) {
  const router = useRouter()
  const session = useSession()
  const [postStates, setPostStates] = React.useState<{[key: string]: {
    isLiked: boolean,
    isBookmarked: boolean,
    likesCount: number
  }}>({})

  // Initialize states for each post
  React.useEffect(() => {
    if (!session?.data?.user) return

    posts.forEach(async (post) => {
      try {
        const {bookmark, like} = await checkLikeBookmarkStatusAction(
          session?.data?.user?.id!,
          post.id
        )
        setPostStates(prev => ({
          ...prev,
          [post.id]: {
            isLiked: !!like,
            isBookmarked: !!bookmark,
            likesCount: post.likes.length
          }
        }))
      } catch (error) {
        console.log("Error", error)
      }
    })
  }, [posts, session?.data?.user])

  const handleLike = async (postId: string) => {
    if (!session?.data?.user) return toast("Please login to like")
    
    try {
      const currentState = postStates[postId]
      if (currentState?.isLiked) {
        await removeLikeAction(session?.data?.user?.id!, postId)
        setPostStates(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            isLiked: false,
            likesCount: prev[postId].likesCount - 1
          }
        }))
      } else {
        await addLikeAction(session?.data?.user?.id!, postId)
        setPostStates(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            isLiked: true,
            likesCount: prev[postId].likesCount + 1
          }
        }))
      }
    } catch (error) {
      toast("Error updating like")
    }
  }

  const handleBookmark = async (postId: string) => {
    if (!session?.data?.user) return toast("Please login to bookmark")
    
    try {
      const currentState = postStates[postId]
      if (currentState?.isBookmarked) {
        await removeFromBookmarkAction(session?.data?.user?.id!, postId)
        setPostStates(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            isBookmarked: false
          }
        }))
      } else {
        await addToBookmarkAction(session?.data?.user?.id!, postId)
        setPostStates(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            isBookmarked: true
          }
        }))
      }
    } catch (error) {
      toast("Error updating bookmark")
    }
  }

  const formatPostDate = (date: Date) => {
    const now = new Date();
    
    // Within last 24 hours
    if (isWithinInterval(date, { start: subHours(now, 24), end: now })) {
      return formatDistance(date, now, { addSuffix: true });  // "3 hours ago"
    }
    
    // Within last year
    if (isWithinInterval(date, { start: subYears(now, 1), end: now })) {
      return format(date, 'MMM d');  // "Nov 10"
    }
    
    // More than a year ago
    return format(date, 'MMM d, yyyy');  // "Dec 3, 2023"
  };

  return (
    <div className={cn('min-h-screen mt-10')}>
      <div className="bg-background text-foreground rounded-t-xl">
        <div className="max-w-2xl flex justify-center">
          {/* <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/75 border-b border-border p-4">
            <h1 className="text-xl font-bold">Explore</h1>
          </header> */}
          
          <main>
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-border p-4 hover:bg-muted transition-colors cursor-pointer bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 w-[400px] sm:w-[600px] lg:w-[800px]"
                  onClick={() => router.push(`/post/${post.id}`)}
                >
                  <div className="flex gap-4">
                    <Avatar 
                      className="w-12 h-12 cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/profile/${post.user.id}`)
                      }}
                    >
                      <AvatarImage src={post.user.image ?? undefined} alt={post.user.name ?? undefined} />
                      <AvatarFallback>{post.user.name?.[0] ?? ""}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span 
                            className="font-bold hover:underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/profile/${post.user.id}`)
                            }}
                          >
                            {post.user.name}
                          </span>
                          {post.user && (
                            <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24">
                              <path
                                fill="currentColor"
                                d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"
                              />
                            </svg>
                          )}
                          {/* <span className="text-muted-foreground">
                            @{post.user.email}
                          </span>
                          <span className="text-muted-foreground">·</span> */}
                          <span className="text-muted-foreground">{formatPostDate(new Date(post.createdAt))}</span>
                        </div>
                        <Button onClick={(e) => e.stopPropagation()} variant="ghost" size="icon" className="rounded-full">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="whitespace-pre-wrap">
                          {post.caption}
                        </p>
                        
                        {post.mediaUrl && (
                          <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="rounded-xl overflow-hidden"
                          >
                            {post.mediaType === 'image' ? (
                              <Image
                                src={post.mediaUrl}
                                alt="Post media"
                                width={600}
                                height={400}
                                className="w-full object-cover"
                              />
                            ) : (
                              <VideoPlayer src={post.mediaUrl} />
                            )}
                          </motion.div>
                        )}
                        
                        <div className="flex items-center justify-between text-muted-foreground">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:text-blue-500 gap-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/post/${post.id}`)
                            }}
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span>{post.comments.length}</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`gap-2 ${postStates[post.id]?.isLiked ? 'text-red-500' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleLike(post.id)
                            }}
                          >
                            <Heart className={`w-5 h-5 ${postStates[post.id]?.isLiked ? 'fill-current' : ''}`} />
                            <span>{postStates[post.id]?.likesCount || post.likes.length}</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={postStates[post.id]?.isBookmarked ? 'text-primary' : ''}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleBookmark(post.id)
                            }}
                          >
                            <Bookmark className={`w-5 h-5 ${postStates[post.id]?.isBookmarked ? 'fill-current' : ''}`} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ShareDialog post={post} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}

function VideoPlayer({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(true)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={src}
        className="w-full rounded-xl"
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
      />
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  )
}