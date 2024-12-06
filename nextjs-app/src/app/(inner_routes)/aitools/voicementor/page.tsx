'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Mic, Plus, Bot, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input2'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { getVoiceMentorsAction, createVoiceMentorAction, deleteVoiceMentorAction } from '@/app/(inner_routes)/aitools/voicementor/actions'
import { useSession } from 'next-auth/react'
import LoadingComponent from '../../loading'

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
      try {
        const data = await getVoiceMentorsAction()
        setMentors(data)
      } catch (error) {
        toast.error('Failed to load voice mentors')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMentors()
  }, [])

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  if (isLoading) {
    return <LoadingComponent />
  }

//   if (!session?.data?.user) {
//     toast("You need to be logged in to see Profile.");
//     return router.push('/explore');
//   }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-zinc-100 via-zinc-200 to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center border border-zinc-300/50 dark:border-zinc-800/50"
          >
            <Mic className="w-10 h-10 text-zinc-700 dark:text-zinc-300" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-700 dark:from-zinc-200 dark:via-zinc-300 dark:to-zinc-200 mb-4">
            Voice Mentors
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
            Create and manage your AI voice mentors. Each mentor can be customized for different learning purposes.
          </p>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-zinc-700 to-zinc-800 dark:from-zinc-600 dark:to-zinc-700 hover:from-zinc-800 hover:to-zinc-900 text-white"
                size="lg"
              >
                <Plus className="mr-2 h-4 w-4" /> Create New Mentor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">Create Voice Mentor</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Input
                    id="name"
                    placeholder="Enter mentor name"
                    value={mentorName}
                    onChange={(e) => setMentorName(e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                  />
                </div>
                <div className="space-y-2">
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
                  <Textarea
                    id="description"
                    placeholder="Enter mentor description"
                    value={mentorDescription}
                    onChange={(e) => setMentorDescription(e.target.value)}
                    className="h-32 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                  />
                </div>
                <Button 
                  onClick={handleCreateMentor}
                  className="w-full bg-gradient-to-r from-zinc-700 to-zinc-800 dark:from-zinc-600 dark:to-zinc-700 hover:from-zinc-800 hover:to-zinc-900 text-white"
                >
                  Create Mentor
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">Delete Voice Mentor</DialogTitle>
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
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {mentors.map((mentor) => (
            <motion.div
              key={mentor.id}
              variants={item}
              className="cursor-pointer group"
            >
              <Card 
                className="h-full relative overflow-hidden backdrop-blur-lg bg-gradient-to-br from-zinc-100/90 to-zinc-200/90 dark:from-zinc-900/90 dark:to-zinc-950/90 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-400/50 dark:hover:border-zinc-700/50 transition-all duration-500"
                onClick={() => router.push(`/aitools/voicementor/${mentor.id}`)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-300/10 to-zinc-400/10 dark:from-zinc-800/10 dark:to-zinc-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-zinc-200/50 dark:to-zinc-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <Bot className="w-8 h-8 text-zinc-700 dark:text-zinc-300" />
                    <div className="flex items-center space-x-4">
                      {mentor.lastUsed && (
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                          Last used: {new Date(mentor.lastUsed).toLocaleDateString()}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-100 dark:hover:bg-red-900/30"
                        onClick={(e) => handleDeleteClick(e, mentor)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-zinc-800 dark:text-zinc-200">
                    {mentor.name}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {mentor.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}