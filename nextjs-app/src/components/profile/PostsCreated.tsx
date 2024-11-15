'use client'

import { useProfilePostsStore } from '@/store/post'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share,
  Bookmark,
  Trash2,
} from 'lucide-react'
import { formatDistance, format, isWithinInterval, subHours, subYears } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { 
  addLikeAction, 
  removeLikeAction,
  checkLikeBookmarkStatusAction,
  addToBookmarkAction,
  removeFromBookmarkAction,
} from '@/app/(inner_routes)/post/[...slug]/actions'
import { ShareDialog } from "@/components/post/ShareDialog"
import { IconPhoto } from '@tabler/icons-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deletePostAction } from '@/app/(inner_routes)/profile/[slug]/actions'

export default function PostsCreated() {
  const { posts, setPosts } = useProfilePostsStore()
  const router = useRouter()
  const session = useSession()
  const [postStates, setPostStates] = useState<{[key: string]: {
    isLiked: boolean;
    isBookmarked: boolean;
    likesCount: number;
  }}>({})

  useEffect(() => {
    if (!session?.data?.user) return
    
    posts.forEach(async (post) => {
      try {
        const {like, bookmark} = await checkLikeBookmarkStatusAction(
          session?.data?.user?.id!,
          post.id
        )
        setPostStates(prev => ({
          ...prev,
          [post.id]: {
            isLiked: !!like,
            isBookmarked: !!bookmark,
            likesCount: post.likes?.length!
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

  const handleBookmark = async (postId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
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

  const handleDelete = async (postId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!session?.data?.user) return toast("Please login to delete")
    
    try {
      await deletePostAction(postId, session?.data?.user?.id!)
      toast.success("Post deleted successfully")
      // Remove the post from the local state
      const filteredPosts = posts.filter((p) => p.id !== postId)
      setPosts(filteredPosts)
    } catch (error) {
      toast.error("Error deleting post")
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
        <IconPhoto size={30} stroke={2} />
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
          No posts yet
        </h3>
      </div>
    )
  }

  return (
    <div className="space-y-4">
        <h2 className="text-center mt-10 mb-8 text-2xl font-bold">Posts Created</h2>
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
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.user?.image ?? undefined} alt={post.user?.name ?? undefined} />
                <AvatarFallback>{post.user?.name?.[0] ?? ""}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{post.user?.name}</span>
                    <span className="text-muted-foreground">{formatPostDate(new Date(post.createdAt))}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }} 
                        variant="ghost" 
                        size="icon"
                        className="relative z-50"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    {session?.data?.user?.id === post.userId && (
                    <DropdownMenuContent 
                      className="relative z-50 dark:bg-zinc-950"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                        <DropdownMenuItem
                          className="focus:text-destructive cursor-pointer dark:bg-zinc-950"
                          onClick={(e) => handleDelete(post.id, e)}
                        >
                            <Trash2 className="w-4 h-4" />
                          Delete post
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                      )}
                  </DropdownMenu>
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
                      <span>{post.comments?.length}</span>
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
                      <span>{postStates[post.id]?.likesCount || post.likes?.length}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => handleBookmark(post.id, e)}
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
