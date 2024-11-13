'use client'

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
  Bookmark, // Add this import
} from 'lucide-react'
import { BookmarkPost } from '@/types'
import { formatDistance, format, isWithinInterval, subHours, subYears } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { 
  addLikeAction, 
  removeLikeAction,
  checkLikeBookmarkStatusAction,
  removeFromBookmarkAction, // Add this import
} from '@/app/(inner_routes)/post/[...slug]/actions'
import { ShareDialog } from "@/components/post/ShareDialog"
import { IconBookmark } from '@tabler/icons-react'

export default function BmPosts({bookmarkPosts, setBookmarkPosts}: {bookmarkPosts: BookmarkPost[], setBookmarkPosts: React.Dispatch<React.SetStateAction<BookmarkPost[]>>}) {
  const router = useRouter()
  const session = useSession()
  const [postStates, setPostStates] = useState<{[key: string]: {
    isLiked: boolean,
    likesCount: number
  }}>({})
  const [localBookmarkPosts, setLocalBookmarkPosts] = useState(bookmarkPosts)

  useEffect(() => {
    if (!session?.data?.user) return
    
    bookmarkPosts.forEach(async (bookmark) => {
      try {
        const {like} = await checkLikeBookmarkStatusAction(
          session?.data?.user?.id!,
          bookmark.post?.id!
        )
        setPostStates(prev => ({
          ...prev,
          [bookmark.post?.id!]: {
            isLiked: !!like,
            likesCount: bookmark.post?.likes?.length!
          }
        }))
      } catch (error) {
        console.log("Error", error)
      }
    })
  }, [bookmarkPosts, session?.data?.user])

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

  const handleRemoveBookmark = async (postId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!session?.data?.user) return toast("Please login to remove bookmark")
    
    try {
      await removeFromBookmarkAction(session?.data?.user?.id!, postId)
      // Remove the post from local state immediately
      setLocalBookmarkPosts(prev => prev.filter(bookmark => bookmark.post?.id !== postId))
      setBookmarkPosts(prev => prev.filter(bookmark => bookmark.post?.id !== postId))
      toast.success("Bookmark removed successfully")
    } catch (error) {
      toast.error("Error removing bookmark")
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

  if (localBookmarkPosts.length === 0) {
    return (
      <div className="flex items-center justify-center gap-1 my-20">
        <IconBookmark size={30} stroke={2} />
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
          No bookmarks yet
        </h3>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {localBookmarkPosts.map((bookmark, index) => (
          <motion.article
            key={bookmark.post?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="border border-border p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => router.push(`/post/${bookmark.post?.id}`)}
          >
            <div className="flex gap-4">
              <Avatar 
                className="w-12 h-12 cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/profile/${bookmark.post?.user.id}`)
                }}
              >
                <AvatarImage src={bookmark.post?.user.image ?? undefined} alt={bookmark.post?.user.name ?? undefined} />
                <AvatarFallback>{bookmark.post?.user.name?.[0] ?? ""}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="font-bold hover:underline cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/profile/${bookmark.post?.user.id}`)
                      }}
                    >
                      {bookmark.post?.user.name}
                    </span>
                    <span className="text-muted-foreground">{formatPostDate(new Date(bookmark.post?.createdAt!))}</span>
                  </div>
                  <Button onClick={(e) => e.stopPropagation()} variant="ghost" size="icon">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <p className="whitespace-pre-wrap">{bookmark.post?.caption}</p>
                  
                  {bookmark.post?.mediaUrl && (
                    <div className="rounded-xl overflow-hidden">
                      <Image
                        src={bookmark.post.mediaUrl}
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
                        router.push(`/post/${bookmark.post?.id}`)
                      }}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{bookmark.post?.comments.length}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`gap-2 ${postStates[bookmark.post?.id!]?.isLiked ? 'text-red-500' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike(bookmark.post?.id!)
                      }}
                    >
                      <Heart className={`w-5 h-5 ${postStates[bookmark.post?.id!]?.isLiked ? 'fill-current' : ''}`} />
                      <span>{postStates[bookmark.post?.id!]?.likesCount || bookmark.post?.likes.length!}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary"
                      onClick={(e) => handleRemoveBookmark(bookmark.post?.id!, e)}
                    >
                      <Bookmark className="w-5 h-5 fill-current" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ShareDialog post={bookmark.post} />
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
