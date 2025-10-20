"use client";

import { Copy, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function ShareDialog({course}: {course: any}) {
    const [pageUrl, setPageUrl] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      if (typeof window !== 'undefined') {
        let inviteCode = course?.visibility == "invite-only" ? `?inviteCode=${course.inviteCode}` : "";
        setPageUrl(
          window.location.protocol + "//" + window.location.host + window.location.pathname + inviteCode
        )
      }
    }, [course])
    
    if (!mounted) {
      return null;
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(pageUrl)
        toast("Link copied to clipboard");
    }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Share</Button> */}
        <Share2 />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          {/* <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription> */}
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={pageUrl? pageUrl : ""}
              readOnly
            />
          </div>
          <Button onClick={copyToClipboard} type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
