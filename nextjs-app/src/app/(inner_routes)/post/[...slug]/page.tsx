"use client";

import * as React from 'react'
import Link from 'next/link'  // Add this import
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { prisma } from '@/lib/db'
import { formatDistance, format, isWithinInterval, subHours, subYears } from 'date-fns';
import CommentSec from '@/components/post/CommentSec'
import { 
  addLikeAction, 
  removeLikeAction, 
  addToBookmarkAction, 
  removeFromBookmarkAction,
  checkLikeBookmarkStatusAction,
  getLikesCountAction, 
  getPostDetailsAction
} from './actions';
import { ShareDialog } from "@/components/post/ShareDialog"
import LoadingComponent from '../../loading';

type Props = {
  params: {
    slug: string[];
  };
};

// Change to regular function instead of async
export default function PostPage({ params: { slug } }: Props) {
  const [bookmark, setBookmark] = useState(false);
  const [like, setLike] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const session = useSession();
  const [commentCount, setCommentCount] = useState(0);

  const postId = slug[0];
  const [postDetails, setPostDetails] = React.useState<any>(null);

  // Add function to fetch post details
  const fetchPostDetails = async () => {
    try {
      const data = await getPostDetailsAction(postId);
      setPostDetails(data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchPostDetails();
  }, [postId]);

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

  useEffect(() => {
    const checkLikeBookmarkStatus = async () => {      
      try {
        const {bookmark, like} = await checkLikeBookmarkStatusAction(
          session?.data?.user?.id!,
          postId
        )
        
        if(bookmark) setBookmark(true)
        if(like) setLike(true)
      } catch (error) {
        console.log("Error", error);
      }
    }

    const getLikesCount = async () => {
      try {
        const res = await getLikesCountAction(postId);
        setLikesCount(res);
      } catch (error) {
        console.log("Error", error);
      }
    }

    checkLikeBookmarkStatus();
    getLikesCount();
  }, [session]);

  useEffect(() => {
    if (postDetails) {
      setCommentCount(postDetails.comments.length);
    }
  }, [postDetails]);

  // Add the missing handler functions
  const addToBookmark = async () => {
    try {
      if(!session?.data?.user) return toast("Please login to bookmark");
      await addToBookmarkAction(session?.data?.user?.id!, postId);
      setBookmark(true);
      toast("Added to bookmarks");
    } catch (error) {
      toast("Error adding to bookmarks");
    }
  };

  const removeFromBookmark = async () => {
    try {
      if(!session?.data?.user) return toast("Please login to bookmark");
      await removeFromBookmarkAction(session?.data?.user?.id!, postId);
      setBookmark(false);
      toast("Removed from bookmarks");
    } catch (error) {
      toast("Error removing from bookmarks");
    }
  };

  const addLike = async () => {
    try {
      if(!session?.data?.user) return toast("Please login to like");
      await addLikeAction(session?.data?.user?.id!, postId);
      setLike(true);
      setLikesCount(prev => prev + 1);
      toast("Post liked");
    } catch (error) {
      toast("Error liking post");
    }
  };

  const removeLike = async () => {
    try {
      if(!session?.data?.user) return toast("Please login to like");
      await removeLikeAction(session?.data?.user?.id!, postId);
      setLike(false);
      setLikesCount(prev => prev - 1);
      toast("Post unliked");
    } catch (error) {
      toast("Error unliking post");
    }
  };

  if (!postDetails) return <div className='min-h-[75vh]'><LoadingComponent /></div>

  return (
    <div className="mb-20 pt-10 flex flex-col items-center justify-center">
      <main
        // initial={{ opacity: 0, y: 20 }}
        // animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-white dark:bg-zinc-950 w-[400px] sm:w-[600px] lg:w-[800px]"
      >
        <div className="flex gap-4">
          <Link href={`/profile/${postDetails?.user.id}`}>
            <Avatar className="w-12 h-12 cursor-pointer">
              <AvatarImage src={postDetails?.user.image ?? undefined} alt={postDetails?.user.name ?? undefined} />
              <AvatarFallback>{postDetails?.user?.name?.[0] ?? ""}</AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link href={`/profile/${postDetails?.user.id}`}>
                  <span className="font-bold hover:underline cursor-pointer">
                    {postDetails?.user.name}
                  </span>
                </Link>
                <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"
                  />
                </svg>
                <span className="text-muted-foreground">
                {formatPostDate(new Date(postDetails?.createdAt))}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <p className="whitespace-pre-wrap">{postDetails?.caption}</p>
              
              <div
                // initial={{ scale: 0.95, opacity: 0 }}
                // animate={{ scale: 1, opacity: 1 }}
                className="rounded-xl overflow-hidden"
              >
                {postDetails?.mediaUrl !== "" && (
                  <Image
                    src={postDetails?.mediaUrl ?? ""}
                    alt="Post media"
                    width={800}
                    height={600}
                    className="w-full object-cover rounded-xl"
                  />
                )}
              </div>
              
              <div className="flex items-center justify-between text-muted-foreground relative z-10 pointer-events-auto">
                <Button variant="ghost" size="sm" className="hover:text-blue-500 gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>{commentCount}</span>
                </Button>
                <Button 
                  onClick={async () => {
                    if (like) {
                      await removeLike();
                    } else {
                      await addLike();
                    }
                  }} 
                  variant="ghost" 
                  size="sm" 
                  className={`gap-2 ${like ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}`}
                >
                  <Heart className={`w-5 h-5 ${like ? 'fill-current' : ''}`} />
                  <span>{likesCount}</span>
                </Button>
                <Button 
                  onClick={async () => {
                    if (bookmark) {
                      await removeFromBookmark();
                    } else {
                      await addToBookmark();
                    }
                  }}
                  variant="ghost" 
                  size="sm"
                  className={bookmark ? 'text-primary' : ''}
                >
                  <Bookmark className={`w-5 h-5 ${bookmark ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm">
                  <ShareDialog post={postDetails} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className='w-[400px] sm:w-[600px] lg:w-[800px]'>
        <CommentSec 
          author={postDetails?.user} 
          post={postDetails} 
          onCommentAdd={() => setCommentCount(prev => prev + 1)}
          onCommentDelete={() => setCommentCount(prev => prev - 1)}
        />
      </div>
    </div>
  )
}
