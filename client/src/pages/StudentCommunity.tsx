import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/Footer";
import { StudentNavigation } from "@/components/student/StudentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  MessageCircle, 
  Share2,
  Plus,
  TrendingUp,
  Clock,
  Award,
  Music,
  BookOpen,
  Star,
  ThumbsUp,
  Send,
  Calendar,
  Trophy,
  Heart,
  Search,
  Play,
  Download,
  Volume2,
  MapPin
} from "lucide-react";

interface CommunityPost {
  id: number;
  author: string;
  avatar?: string;
  instrument?: string;
  title?: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  category: 'discussion' | 'achievement' | 'help' | 'showcase';
  tags: string[];
  isLiked?: boolean;
  audioFile?: string;
}

interface StudyGroup {
  id: number;
  name: string;
  description: string;
  members: number;
  category: string;
  level: string;
  nextSession?: string;
  image?: string;
}

interface ForumTopic {
  name: string;
  posts: number;
  icon: string;
}

interface ForumCategory {
  category: string;
  topics: ForumTopic[];
}

interface CommunityEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  participants: number;
  type: string;
  description: string;
  location?: string;
}

const StudentCommunity = () => {
  const [currentUser] = useState(() => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  });

  const [newPost, setNewPost] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample community data - in real app would come from API
  const [posts] = useState<CommunityPost[]>([
    {
      id: 1,
      author: "Sarah Chen",
      avatar: "SC",
      instrument: "Piano",
      content: "Just nailed Chopin's Nocturne in E-flat major after weeks of practice! The key was breaking down the ornaments slowly. Here's my performance:",
      audioFile: "nocturne_performance.mp3",
      timestamp: "2 hours ago",
      likes: 42,
      comments: 8,
      shares: 3,
      category: 'achievement',
      tags: ['classical', 'piano', 'chopin'],
      isLiked: false
    },
    {
      id: 2,
      author: "Mike Rodriguez",
      avatar: "MR",
      instrument: "Guitar",
      content: "Looking for a bassist to jam with this weekend! I'm working on some funk grooves. Anyone in downtown area interested?",
      timestamp: "4 hours ago",
      likes: 15,
      comments: 12,
      shares: 2,
      category: 'help',
      tags: ['jam-session', 'funk', 'guitar', 'collaboration'],
      isLiked: true
    },
    {
      id: 3,
      author: "Emily Watson",
      avatar: "EW",
      instrument: "Violin",
      content: "Quick tip for fellow violinists: Use a pencil eraser to clean rosin buildup from strings. Works like magic! 🎻✨",
      timestamp: "1 day ago",
      likes: 68,
      comments: 15,
      shares: 22,
      category: 'showcase',
      tags: ['tips', 'violin', 'maintenance'],
      isLiked: false
    }
  ]);

  const [studyGroups] = useState<StudyGroup[]>([
    {
      id: 1,
      name: "Jazz Improv Circle",
      description: "Weekly jazz improvisation sessions for intermediate to advanced players.",
      members: 24,
      category: "Mixed",
      level: "Intermediate",
      nextSession: "Tomorrow, 7:00 PM",
      image: "🎷"
    },
    {
      id: 2,
      name: "Classical Piano Study Group",
      description: "Focused study of classical piano repertoire with peer feedback.",
      members: 18,
      category: "Piano",
      level: "Intermediate",
      nextSession: "Sunday, 3:00 PM",
      image: "🎹"
    },
    {
      id: 3,
      name: "Singer-Songwriter Circle",
      description: "Share original songs and get constructive feedback from fellow songwriters.",
      members: 31,
      category: "Voice/Guitar",
      level: "All Levels",
      nextSession: "Friday, 6:30 PM",
      image: "🎤"
    }
  ]);

  const [forums] = useState<ForumCategory[]>([
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
  ]);

  const [events] = useState<CommunityEvent[]>([
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
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'achievement': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'help': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'discussion': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'showcase': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return <Award className="h-4 w-4" />;
      case 'help': return <MessageCircle className="h-4 w-4" />;
      case 'discussion': return <Users className="h-4 w-4" />;
      case 'showcase': return <Star className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <StudentNavigation currentUser={currentUser} className="h-full" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        
        {/* Welcome Section */}
        <section className="py-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-800">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Student Community
              </h1>
              <p className="text-white/80">
                Connect, learn, and grow together with fellow music students
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">1,247</p>
                    <p className="text-xs text-muted-foreground">Active Students</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">89</p>
                    <p className="text-xs text-muted-foreground">Study Groups</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">342</p>
                    <p className="text-xs text-muted-foreground">Posts Today</p>
                  </div>
                  <MessageCircle className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-xs text-muted-foreground">Achievements Shared</p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="feed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="feed">Community Feed</TabsTrigger>
              <TabsTrigger value="groups">Practice Groups</TabsTrigger>
              <TabsTrigger value="forums">Forums</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
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
                    <CardContent>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="What are you practicing today? Share your progress, ask questions, or start a discussion..."
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Volume2 className="h-4 w-4 mr-2" />
                              Add Audio
                            </Button>
                            <Button variant="outline" size="sm">
                              <Music className="h-4 w-4 mr-2" />
                              Add Tags
                            </Button>
                          </div>
                          <Button className="gap-2">
                            <Send className="h-4 w-4" />
                            Post
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Posts */}
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <Card key={post.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={post.avatar} />
                              <AvatarFallback>
                                {post.avatar || post.author.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{post.author}</h4>
                                {post.instrument && (
                                  <Badge variant="secondary">{post.instrument}</Badge>
                                )}
                                <span className="text-sm text-muted-foreground">{post.timestamp}</span>
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
                              
                              <div className="flex flex-wrap gap-1 mb-3">
                                {post.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <button className="flex items-center gap-2 hover:text-primary transition-colors">
                                  <Heart className={`h-4 w-4 ${post.isLiked ? 'text-red-500 fill-red-500' : ''}`} />
                                  {post.likes}
                                </button>
                                <button className="flex items-center gap-2 hover:text-primary transition-colors">
                                  <MessageCircle className="h-4 w-4" />
                                  {post.comments}
                                </button>
                                <button className="flex items-center gap-2 hover:text-primary transition-colors">
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
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Active Study Groups */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">My Study Groups</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {studyGroups.slice(0, 3).map((group) => (
                          <div key={group.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <h4 className="font-medium text-sm">{group.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{group.members} members</p>
                            {group.nextSession && (
                              <div className="flex items-center gap-1 text-xs text-primary">
                                <Clock className="h-3 w-3" />
                                {group.nextSession}
                              </div>
                            )}
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full">
                          View All Groups
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Popular Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Trending Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {["#piano", "#guitar", "#practice-tips", "#jazz", "#classical", "#beginner", "#performance"].map((tag) => (
                          <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
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
                        <div key={index} className="flex items-center gap-3">
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

            <TabsContent value="groups" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Practice Groups</h2>
                  <p className="text-muted-foreground">Join groups to practice and learn together</p>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Group
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studyGroups.map((group) => (
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
                          {group.category}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          {group.nextSession}
                        </div>
                      </div>

                      <Button className="w-full" variant="outline">Join Group</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="forums" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Discussion Forums</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search forums..." className="pl-10 w-64" />
                  </div>
                  <Button>New Topic</Button>
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

            <TabsContent value="events" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Community Events</h2>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
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
                        <Button className="flex-1">Join Event</Button>
                        <Button variant="outline" size="icon">
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

        <Footer />
      </div>
    </div>
  );
};

export default StudentCommunity;