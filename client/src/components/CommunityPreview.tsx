import { MessageCircle, Heart, Share2, Trophy, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const CommunityPreview = () => {
  const posts = [
    {
      id: 1,
      author: "Sarah Chen",
      role: "Guitar Mentor",
      content: "Just finished my first composition! Here's a snippet of my acoustic piece 🎸",
      likes: 47,
      comments: 12,
      shares: 5,
      time: "2h ago"
    },
    {
      id: 2,
      author: "Marcus Rivera",
      role: "Piano Student",
      content: "Finally nailed Chopin's Minute Waltz! Practice really does make perfect 🎹",
      likes: 89,
      comments: 23,
      shares: 8,
      time: "4h ago"
    },
    {
      id: 3,
      author: "Elena Volkov",
      role: "Violin Mentor",
      content: "Hosting a live masterclass on vibrato techniques tomorrow at 3PM EST. Join us!",
      likes: 156,
      comments: 34,
      shares: 28,
      time: "6h ago"
    }
  ];

  const achievements = [
    {
      title: "First Song Learned",
      description: "Complete your first course lesson",
      icon: "🎵",
      earned: 1247
    },
    {
      title: "Practice Streak",
      description: "Practice for 7 consecutive days",
      icon: "🔥",
      earned: 892
    },
    {
      title: "Community Helper",
      description: "Help 10 fellow musicians",
      icon: "🤝",
      earned: 456
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join the Music Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with musicians worldwide, share your progress, get feedback, 
            and celebrate achievements together
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Community Feed */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <MessageCircle className="mr-3 h-6 w-6 text-primary" />
              Community Feed
            </h3>
            
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="p-6 hover:shadow-musical transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-hero text-primary-foreground">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{post.author}</h4>
                        <span className="text-sm bg-accent/20 text-accent-foreground px-2 py-1 rounded">
                          {post.role}
                        </span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{post.time}</span>
                      </div>
                      
                      <p className="text-foreground mb-4">{post.content}</p>
                      
                      <div className="flex items-center space-x-6 text-muted-foreground">
                        <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-primary transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-secondary transition-colors">
                          <Share2 className="h-4 w-4" />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Achievements */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Trophy className="mr-3 h-5 w-5 text-secondary" />
                Recent Achievements
              </h3>
              
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.title} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-primary mt-1">{achievement.earned} earned</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Community Stats */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="mr-3 h-5 w-5 text-primary" />
                Community Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active Members</span>
                  <span className="font-semibold">12,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Posts Today</span>
                  <span className="font-semibold">486</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Live Sessions</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Practice Groups</span>
                  <span className="font-semibold">156</span>
                </div>
              </div>
            </Card>

            <Button variant="hero" className="w-full">
              Join Community
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};