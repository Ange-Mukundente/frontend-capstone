"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MessageSquare, Send, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function VetMessages() {
  const router = useRouter()
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messageText, setMessageText] = useState("")

  const conversations = [
    {
      id: 1,
      farmerName: "Mary",
      lastMessage: "Thank you doctor, the cow is doing much better!",
      time: "10 min ago",
      unread: 2
    },
    {
      id: 2,
      farmerName: "John Doe",
      lastMessage: "What time is my appointment tomorrow?",
      time: "1 hour ago",
      unread: 1
    },
    {
      id: 3,
      farmerName: "Jane Smith",
      lastMessage: "The medication worked perfectly, thank you!",
      time: "2 hours ago",
      unread: 0
    }
  ]

  const messages = selectedConversation ? [
    {
      id: 1,
      sender: "farmer",
      text: "Hello doctor, my cow seems unwell",
      time: "9:00 AM"
    },
    {
      id: 2,
      sender: "vet",
      text: "I can see you today at 2 PM. Can you bring the cow?",
      time: "9:05 AM"
    },
    {
      id: 3,
      sender: "farmer",
      text: "Yes, I'll be there. Thank you!",
      time: "9:10 AM"
    }
  ] : []

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Add message logic here
      alert("Message sent!")
      setMessageText("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-gray-600 mt-2">Communicate with farmers</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card>
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search messages..."
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conv.id ? "bg-blue-50 border-blue-200 border" : "hover:bg-gray-50 border border-transparent"
                  }`}
                  onClick={() => setSelectedConversation(conv.id)}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold">{conv.farmerName}</h4>
                    {conv.unread > 0 && (
                      <Badge className="bg-blue-600">{conv.unread}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                  <p className="text-xs text-gray-400 mt-1">{conv.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Message Thread */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedConversation 
                  ? conversations.find(c => c.id === selectedConversation)?.farmerName 
                  : "Select a conversation"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedConversation ? (
                <div className="space-y-4">
                  <div className="h-96 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === "vet" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-lg ${
                            msg.sender === "vet"
                              ? "bg-blue-600 text-white"
                              : "bg-white border"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.sender === "vet" ? "text-blue-100" : "text-gray-400"}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      rows={2}
                    />
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleSendMessage}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}