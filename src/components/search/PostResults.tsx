'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share,
} from 'lucide-react'
import { ExplorePost } from '@/types'
import { formatDistance, format, isWithinInterval, subHours, subYears } from 'date-fns'
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
import { IconSearch } from '@tabler/icons-react'

export default function PostResults({posts}: {posts: ExplorePost[]}) {
  const router = useRouter()
  const session = useSession()
  const [postStates, setPostStates] = useState<{[key: string]: {
    isLiked: boolean,
    isBookmarked: boolean,
    likesCount: number
  }}>({})

  // Initialize states for each post
  useEffect(() => {
    if (!session?.data?.user) return
    console.log("Posts: ", posts);
    

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
    const now = new Date()
    if (isWithinInterval(date, { start: subHours(now, 24), end: now })) {
      return formatDistance(date, now, { addSuffix: true })
    }
    if (isWithinInterval(date, { start: subYears(now, 1), end: now })) {
      return format(date, 'MMM d')
    }
    return format(date, 'MMM d, yyyy')
  }

  if (posts.length === 0) {
    return (
        <div className="flex items-center justify-center gap-1 my-20">
        <IconSearch size={30} stroke={2} />
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
          Search
        </h3>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="border border-border p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
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
                    <span className="text-muted-foreground">{formatPostDate(new Date(post.createdAt))}</span>
                  </div>
                  <Button onClick={(e) => e.stopPropagation()} variant="ghost" size="icon">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <p className="whitespace-pre-wrap">{post.caption}</p>
                  
                  {post.mediaUrl && (
                    <div className="rounded-xl overflow-hidden">
                      <Image
                        src={post.mediaUrl}
                        alt="Post media"
                        width={600}
                        height={400}
                        className="w-full object-cover"
                      />
                    </div>
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
    </div>
  )
}
