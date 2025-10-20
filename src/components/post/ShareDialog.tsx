"use client";

import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Share } from "lucide-react"

export function ShareDialog({post}: {post: any}) {
    const [pageUrl, setPageUrl] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      if (typeof window !== 'undefined') {
          setPageUrl(
              window.location.protocol + "//" + window.location.host + "/post/" + post.id
          )
      }
    }, [post.id])
    
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
        <Share className="w-5 h-5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
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
