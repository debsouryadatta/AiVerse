'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { FileUpload } from "@/components/ui/file-upload"
import { Label } from "@/components/ui/label"
import { FileText, MessageSquare, Bot, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function ChatWithPDF() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleFileUpload = (uploadedFiles: File[]) => {
    setError("")
    
    if (uploadedFiles.length === 0) {
      setFile(null)
      return
    }

    const selectedFile = uploadedFiles[0]

    // Check if file is a PDF
    if (selectedFile.type !== 'application/pdf') {
      setError("Please upload a PDF document")
      setFile(null)
      toast.error("Only PDF documents are allowed")
      return
    }

    // Set the file
    setFile(selectedFile)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-zinc-100 via-zinc-200 to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100">
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
            <FileText className="w-10 h-10 text-zinc-700 dark:text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-700 dark:from-zinc-200 dark:via-zinc-300 dark:to-zinc-200 mb-4">
            Chat with PDF
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            Upload your PDF document and start an interactive conversation. Get instant answers and insights from your documents.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="p-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
            <div className="mb-6">
              <Label className="text-lg mb-2 block">Upload PDF Document</Label>
              <div className="w-full mx-auto border border-dashed bg-gray-300/20 dark:bg-zinc-950/50 border-neutral-200 dark:border-neutral-800 rounded-lg">
                <FileUpload 
                  onChange={handleFileUpload}
                  accept=".pdf"
                  maxFiles={1}
                />
              </div>
              {error && (
                <div className="mt-2 text-red-500 dark:text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {file && (
              <div className="mt-4">
                <Label className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Selected file: {file.name}
                </Label>
                <Button 
                  className="w-full mt-4 bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-200 dark:to-zinc-300 text-white dark:text-zinc-900"
                >
                  Start Chat
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
