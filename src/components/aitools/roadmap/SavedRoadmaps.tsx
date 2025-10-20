'use client'

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { deleteSavedRoadmapAction, getSavedRoadmapsAction } from "@/app/(inner_routes)/aitools/roadmap/actions"
import { Bookmark, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Roadmap } from "@prisma/client"
import RoadmapComp from "./RoadmapComp"


export default function SavedRoadmaps() {
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const session = useSession()

  const fetchRoadmaps = async () => {
    if (!session.data?.user?.id) return
    setLoading(true)
    try {
      const data = await getSavedRoadmapsAction(session.data.user.id)
      setRoadmaps(data)
    } catch (error) {
      toast.error("Failed to fetch saved roadmaps")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      await deleteSavedRoadmapAction(id, session?.data?.user?.id!)
      setRoadmaps(prev => prev.filter(roadmap => roadmap.id !== id))
      toast.success("Roadmap deleted successfully")
    } catch (error) {
      toast.error("Failed to delete roadmap")
    } finally {
      setDeleting(null)
    }
  }

  const handleViewRoadmap = (roadmap: Roadmap) => {
    setSelectedRoadmap(roadmap)
    setDialogOpen(true)
    setOpen(false)
  }

  useEffect(() => {
    if (open) {
      fetchRoadmaps()
    }
  }, [open, session.data?.user?.id])

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <div className="group cursor-pointer">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 transition-colors backdrop-blur-md border border-zinc-200 dark:border-white/20">
              <Bookmark className="w-4 h-4 text-amber-500 dark:text-yellow-400 group-hover:text-amber-600 dark:group-hover:text-yellow-300 transition-colors" />
              <span className="text-sm font-medium text-zinc-800 dark:text-white/90 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                Saved Roadmaps
              </span>
            </div>
          </div>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg p-0 bg-gray-200 dark:bg-zinc-900 border-none">
          <SheetHeader className="p-6 text-center border-b border-gray-300 dark:border-zinc-800">
            <SheetTitle className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Your Saved Roadmaps</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] px-6">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-6 w-6 animate-spin text-neutral-800 dark:text-neutral-200" />
              </div>
            ) : roadmaps.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No saved roadmaps found
              </div>
            ) : (
              <div className="space-y-4 py-4">
                {roadmaps.map((roadmap) => (
                  <Card 
                    key={roadmap.id} 
                    className="p-4 bg-white/50 dark:bg-zinc-800/50 border-none backdrop-blur-xl hover:bg-white/70 dark:hover:bg-zinc-800/70 cursor-pointer transition-all duration-200"
                    onClick={() => handleViewRoadmap(roadmap)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold capitalize text-neutral-800 dark:text-neutral-200">{roadmap.title}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/20",
                          deleting === roadmap.id && "cursor-not-allowed opacity-50"
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(roadmap.id)
                        }}
                        disabled={deleting === roadmap.id}
                      >
                        {deleting === roadmap.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 bg-white dark:bg-zinc-900 border-none">
          <DialogHeader className="p-6 border-b border-gray-200 dark:border-zinc-800">
            <DialogTitle className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
              {selectedRoadmap?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 h-full">
            {selectedRoadmap && (
              <RoadmapComp roadmap={JSON.parse(selectedRoadmap.roadmap as string)} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}