'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input2'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { getVoiceMentorsAction, createVoiceMentorAction, deleteVoiceMentorAction } from '@/app/(inner_routes)/aitools/voicementor/actions'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'

interface Mentor {
  id: string
  name: string
  description: string
  lastUsed?: Date
  createdAt: Date
  updatedAt: Date
  userId: string
}

export default function VoiceMentorPage() {
  const router = useRouter()
  const session = useSession()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [mentorToDelete, setMentorToDelete] = useState<Mentor | null>(null)
  const [mentorName, setMentorName] = useState('')
  const [mentorDescription, setMentorDescription] = useState('')
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [voiceId, setVoiceId] = useState<string>("aura-luna-en")

  useEffect(() => {
    const fetchMentors = async () => {      
      if(!session?.data?.user?.id) {
        setIsLoading(false)
        return
      }
      try {
        const data = await getVoiceMentorsAction(session?.data?.user?.id!)
        setMentors(data)
      } catch (error) {
        toast.error('Failed to load voice mentors')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMentors()
  }, [session])

  const handleCreateMentor = async () => {
    if (!mentorName.trim() || !mentorDescription.trim()) return
    
    if (!session?.data?.user?.id) {
      toast.error('Please sign in to create a voice mentor')
      return
    }

    try {
      const newMentor = await createVoiceMentorAction(
        mentorName,
        mentorDescription,
        voiceId,
        session?.data?.user?.id
      )
      setMentors([...mentors, newMentor])
      setMentorName('')
      setMentorDescription('')
      setIsDialogOpen(false)
      toast.success('Voice mentor created successfully!')
      router.refresh()
    } catch (error) {
      toast.error('Failed to create voice mentor')
    }
  }

  const handleDeleteClick = (e: React.MouseEvent, mentor: Mentor) => {
    e.stopPropagation()
    setMentorToDelete(mentor)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteMentor = async () => {
    if (!mentorToDelete || !session?.data?.user?.id) return

    try {
      await deleteVoiceMentorAction(mentorToDelete.id, session?.data?.user?.id)
      setMentors(mentors.filter(m => m.id !== mentorToDelete.id))
      setMentorToDelete(null)
      setIsDeleteDialogOpen(false)
      toast.success('Voice mentor deleted successfully!')
      router.refresh()
    } catch (error) {
      toast.error('Failed to delete voice mentor')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-600 dark:text-zinc-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
              <Mic className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
                Voice Mentors
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                Create and manage your AI voice mentors
              </p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-900 dark:hover:bg-zinc-600 text-white"
                size="lg"
                disabled={!session?.data?.user?.id}
              >
                <Plus className="mr-2 h-4 w-4" /> New Mentor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-white">Create Voice Mentor</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                  <Input
                    id="name"
                    placeholder="Enter mentor name"
                    value={mentorName}
                    onChange={(e) => setMentorName(e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Voice</label>
                  <Select value={voiceId} onValueChange={setVoiceId}>
                    <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700">
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700">
                      <SelectItem value="aura-luna-en">Female US Accent</SelectItem>
                      <SelectItem value="aura-athena-en">Female UK Accent</SelectItem>
                      <SelectItem value="aura-orion-en">Male US Accent</SelectItem>
                      <SelectItem value="aura-helios-en">Male UK Accent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                  <Textarea
                    id="description"
                    placeholder="Enter mentor description"
                    value={mentorDescription}
                    onChange={(e) => setMentorDescription(e.target.value)}
                    className="h-32 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 resize-none"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleCreateMentor}
                  className="w-full bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-900 dark:hover:bg-zinc-600 text-white"
                >
                  Create Mentor
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Mentors Grid */}
        {mentors.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-4 text-zinc-400">
              <Mic className="w-12 h-12 mx-auto opacity-30" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              No voice mentors yet
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Create your first voice mentor to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentors.map((mentor) => (
              <Card
                key={mentor.id}
                className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer p-6"
                onClick={() => router.push(`/aitools/voicementor/${mentor.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded">
                    <Mic className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                    onClick={(e) => handleDeleteClick(e, mentor)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  {mentor.name}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {mentor.description}
                </p>
                {mentor.lastUsed && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    Last used: {new Date(mentor.lastUsed).toLocaleDateString()}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-white">Delete Voice Mentor</DialogTitle>
              <DialogDescription className="text-zinc-600 dark:text-zinc-400">
                Are you sure you want to delete "{mentorToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteMentor}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}