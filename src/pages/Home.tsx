import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Search, HandHeart, TrendingUp, Infinity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10 text-center">
          <div className="inline-block mb-6 animate-float">
            <Infinity className="w-24 h-24 text-white drop-shadow-glow" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            HelpInfinity
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Spread Kindness Infinitely - Connect Donors with Recipients
          </p>
          <Link to="/donate">
            <Button variant="hero" className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Heart className="w-5 h-5" />
              Start Donating Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/donate" className="group">
            <Card className="h-full transition-all hover:shadow-medium hover:-translate-y-2 cursor-pointer bg-gradient-card border-0">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4 group-hover:scale-110 transition-smooth">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Donate Items</h3>
                <p className="text-muted-foreground">
                  Share your unused items with those who need them. Make a difference today!
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/browse" className="group">
            <Card className="h-full transition-all hover:shadow-medium hover:-translate-y-2 cursor-pointer bg-gradient-card border-0">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4 group-hover:scale-110 transition-smooth">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Browse Donations</h3>
                <p className="text-muted-foreground">
                  Find items you need from generous donors in your community.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/request" className="group">
            <Card className="h-full transition-all hover:shadow-medium hover:-translate-y-2 cursor-pointer bg-gradient-card border-0">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4 group-hover:scale-110 transition-smooth">
                  <HandHeart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Request Help</h3>
                <p className="text-muted-foreground">
                  Post what you need and let the community help you out.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard" className="group">
            <Card className="h-full transition-all hover:shadow-medium hover:-translate-y-2 cursor-pointer bg-gradient-card border-0">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4 group-hover:scale-110 transition-smooth">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Track Impact</h3>
                <p className="text-muted-foreground">
                  See the real-time impact of donations and requests in the community.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Community of Givers
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Every donation matters. Start making a difference today.
          </p>
          <Link to="/auth">
            <Button variant="hero" className="bg-white text-primary hover:bg-white/90">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
