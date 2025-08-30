import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthDialog } from "@/components/AuthDialog";
import { getCurrentUser, isAuthenticated, onAuthStateChange } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Music, 
  Users, 
  Calendar, 
  Trophy,
  Search,
  Plus,
  Play,
  Download,
  Star,
  Clock,
  MapPin,
  Volume2
} from "lucide-react";

const Community = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState("");
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  // Listen for auth state changes
  useEffect(() => {
    const cleanup = onAuthStateChange((user) => {
      setCurrentUser(user);
    });
    
    return cleanup;
  }, []);

  const handleInteraction = (action: string) => {
    // Always show sign-in dialog for demo - even if user is somehow authenticated on main pages
    setSelectedFeature(action);
    setAuthDialogOpen(true);
  };

  const posts = [
    {
      id: 1,
      author: "Sarah Chen",
      avatar: "SC",
      instrument: "Piano",
      time: "2 hours ago",
      content: "Just nailed Chopin's Nocturne in E-flat major after weeks of practice! The key was breaking down the ornaments slowly. Here's my performance:",
      audioFile: "nocturne_performance.mp3",
      likes: 42,
      comments: 8,
      shares: 3,
      tags: ["classical", "piano", "chopin"]
    },
    {
      id: 2,
      author: "Mike Rodriguez",
      avatar: "MR",
      instrument: "Guitar",
      time: "4 hours ago",
      content: "Looking for a bassist to jam with this weekend! I'm working on some funk grooves. Anyone in downtown area interested?",
      likes: 15,
      comments: 12,
      shares: 2,
      tags: ["jam-session", "funk", "guitar", "collaboration"]
    },
    {
      id: 3,
      author: "Emily Watson",
      avatar: "EW",
      instrument: "Violin",
      time: "1 day ago",
      content: "Quick tip for fellow violinists: Use a pencil eraser to clean rosin buildup from strings. Works like magic! 🎻✨",
      likes: 68,
      comments: 15,
      shares: 22,
      tags: ["tips", "violin", "maintenance"]
    }
  ];

  const practiceGroups = [
    {
      id: 1,
      name: "Jazz Improv Circle",
      members: 24,
      instrument: "Mixed",
      nextSession: "Tomorrow, 7:00 PM",
      description: "Weekly jazz improvisation sessions for intermediate to advanced players.",
      image: "🎷"
    },
    {
      id: 2,
      name: "Classical Piano Study Group",
      members: 18,
      instrument: "Piano",
      nextSession: "Sunday, 3:00 PM",
      description: "Focused study of classical piano repertoire with peer feedback.",
      image: "🎹"
    },
    {
      id: 3,
      name: "Singer-Songwriter Circle",
      members: 31,
      instrument: "Voice/Guitar",
      nextSession: "Friday, 6:30 PM",
      description: "Share original songs and get constructive feedback from fellow songwriters.",
      image: "🎤"
    }
  ];

  const forums = [
    {
      category: "Instruments",
      topics: [
        { name: "Guitar", posts: 1242, icon: "🎸" },
        { name: "Piano", posts: 987, icon: "🎹" },
        { name: "Violin", posts: 543, icon: "🎻" },
        { name: "Drums", posts: 678, icon: "🥁" },
        { name: "Voice", posts: 432, icon: "🎤" }
      ]
    },
    {
      category: "Genres",
      topics: [
        { name: "Classical", posts: 765, icon: "🎼" },
        { name: "Jazz", posts: 543, icon: "🎷" },
        { name: "Rock", posts: 892, icon: "🤘" },
        { name: "Folk", posts: 234, icon: "🪕" },
        { name: "Electronic", posts: 456, icon: "🎧" }
      ]
    }
  ];

  const events = [
    {
      id: 1,
      title: "Virtual Open Mic Night",
      date: "March 15, 2024",
      time: "8:00 PM EST",
      participants: 45,
      type: "Virtual",
      description: "Join us for a monthly open mic where musicians of all levels can perform and connect."
    },
    {
      id: 2,
      title: "Guitar Workshop: Fingerpicking Techniques",
      date: "March 18, 2024",
      time: "2:00 PM PST",
      participants: 28,
      type: "Workshop",
      description: "Master the art of fingerpicking with expert guitarist Maria Santos."
    },
    {
      id: 3,
      title: "Local Jam Session - NYC",
      date: "March 20, 2024",
      time: "7:00 PM EST",
      participants: 12,
      type: "In-Person",
      location: "Brooklyn Music Studio",
      description: "In-person jam session for intermediate musicians in New York City area."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        

        {/* Welcome Banner */}
        <div className="mb-8">
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Users className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold bg-gradient-hero bg-clip-text text-transparent">
                  Welcome to HarmonyLearn Community
                </h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Discover our vibrant music community where musicians share, learn, and grow together. Join thousands of passionate learners on their musical journey.
              </p>
              <Button onClick={() => handleInteraction("join community")} className="bg-gradient-hero hover:opacity-90">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">12,547</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">8,392</div>
              <div className="text-sm text-muted-foreground">Posts This Month</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Music className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">1,245</div>
              <div className="text-sm text-muted-foreground">Shared Recordings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">89</div>
              <div className="text-sm text-muted-foreground">Upcoming Events</div>
            </CardContent>
          </Card>
        </div>



        {/* Main Content Tabs with Overlay */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none" />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 relative">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed">Community Feed</TabsTrigger>
            <TabsTrigger value="groups">Practice Groups</TabsTrigger>
            <TabsTrigger value="forums">Forums</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          {/* Community Feed */}
          <TabsContent value="feed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Feed */}
              <div className="lg:col-span-2 space-y-6">
                {/* Create Post */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Share Your Musical Journey
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea placeholder="What are you practicing today? Share your progress, ask questions, or start a discussion..." />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Volume2 className="h-4 w-4 mr-2" />
                          Add Audio
                        </Button>
                        <Button variant="outline" size="sm">
                          <Music className="h-4 w-4 mr-2" />
                          Add Tags
                        </Button>
                      </div>
                      <Button variant="hero" onClick={() => handleInteraction("post creation")}>Post</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts */}
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>{post.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{post.author}</h4>
                            <Badge variant="secondary">{post.instrument}</Badge>
                            <span className="text-sm text-muted-foreground">{post.time}</span>
                          </div>
                          <p className="text-foreground mb-3">{post.content}</p>
                          
                          {post.audioFile && (
                            <div className="bg-muted p-3 rounded-lg mb-3 flex items-center gap-3">
                              <Button size="icon" variant="outline">
                                <Play className="h-4 w-4" />
                              </Button>
                              <div className="flex-1">
                                <div className="font-medium">{post.audioFile}</div>
                                <div className="text-sm text-muted-foreground">Audio Recording • 2:43</div>
                              </div>
                              <Button size="icon" variant="ghost">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <button 
                              className="flex items-center gap-2 hover:text-primary transition-colors"
                              onClick={() => handleInteraction("like post")}
                            >
                              <Heart className="h-4 w-4" />
                              {post.likes}
                            </button>
                            <button 
                              className="flex items-center gap-2 hover:text-primary transition-colors"
                              onClick={() => handleInteraction("comment on post")}
                            >
                              <MessageCircle className="h-4 w-4" />
                              {post.comments}
                            </button>
                            <button 
                              className="flex items-center gap-2 hover:text-primary transition-colors"
                              onClick={() => handleInteraction("share post")}
                            >
                              <Share2 className="h-4 w-4" />
                              {post.shares}
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Popular Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Trending Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {["#piano", "#guitar", "#practice-tips", "#jazz", "#classical", "#beginner", "#performance"].map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => handleInteraction("explore tag")}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Featured Members */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Featured Members</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: "Alex Chen", instrument: "Jazz Piano", followers: "2.3k" },
                      { name: "Maria Santos", instrument: "Classical Guitar", followers: "1.8k" },
                      { name: "David Kim", instrument: "Violin", followers: "1.5k" }
                    ].map((member, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                        onClick={() => handleInteraction("view member profile")}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.instrument}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">{member.followers}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Practice Groups */}
          <TabsContent value="groups" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Practice Groups</h2>
              <Button variant="hero" onClick={() => handleInteraction("create practice group")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {practiceGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4 text-center">{group.image}</div>
                    <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{group.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        {group.members} members
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Music className="h-4 w-4" />
                        {group.instrument}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        {group.nextSession}
                      </div>
                    </div>

                    <Button className="w-full" variant="outline" onClick={() => handleInteraction("join practice group")}>Join Group</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Forums */}
          <TabsContent value="forums" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Discussion Forums</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search forums..." 
                    className="pl-10 w-64" 
                    onFocus={() => handleInteraction("search forums")}
                  />
                </div>
                <Button variant="hero" onClick={() => handleInteraction("create forum topic")}>New Topic</Button>
              </div>
            </div>

            {forums.map((forum, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{forum.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {forum.topics.map((topic, topicIndex) => (
                      <div 
                        key={topicIndex}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleInteraction("view forum topic")}
                      >
                        <div className="text-2xl">{topic.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium">{topic.name}</div>
                          <div className="text-sm text-muted-foreground">{topic.posts} posts</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Events */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Community Events</h2>
              <Button variant="hero" onClick={() => handleInteraction("create event")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <Badge variant={event.type === "Virtual" ? "secondary" : event.type === "Workshop" ? "default" : "outline"}>
                        {event.type}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-4">{event.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        {event.participants} participants
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => handleInteraction("join event")}>Join Event</Button>
                      <Button variant="outline" size="icon" onClick={() => handleInteraction("share event")}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
      
      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen}
        featureName={selectedFeature}
      />
    </div>
  );
};

export default Community;