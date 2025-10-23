import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Gift, 
  CheckCircle, 
  HandHeart, 
  Users, 
  Calendar, 
  MapPin, 
  User,
  TrendingUp,
  Activity,
  Award,
  Clock,
  Package,
  Heart,
  Target,
  Sparkles
} from 'lucide-react';

// Mock API - Replace with your actual API
const API_BASE_URL = 'https://help-infinity.onrender.com/api';

const getAuthToken = () => localStorage.getItem('auth_token');

async function apiCall(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentItems, setRecentItems] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const [statsData, recentData, leaderboardData] = await Promise.all([
        apiCall('/dashboard/stats'),
        apiCall('/dashboard/recent'),
        apiCall('/donations/leaderboard').catch(() => [])
      ]);
      setStats(statsData);
      setRecentItems(recentData);
      setLeaderboard(leaderboardData.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, value, label, color, delay }) => (
    <Card 
      className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: delay }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`} />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          </div>
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs">
          <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
          <span className="text-green-500 font-medium">Active</span>
        </div>
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ item, type }) => (
    <div className="group flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-300">
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${
        type === 'donation' ? 'from-blue-500 to-purple-600' : 'from-orange-500 to-pink-600'
      } flex items-center justify-center shadow-lg`}>
        {type === 'donation' ? (
          <Gift className="w-6 h-6 text-white" />
        ) : (
          <HandHeart className="w-6 h-6 text-white" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
            {item.title}
          </h4>
          <Badge 
            variant={item.status === 'Available' || item.status === 'Active' ? 'default' : 'secondary'}
            className="flex-shrink-0"
          >
            {item.status}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
        
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
            <User className="w-3 h-3" />
            {type === 'donation' ? item.Donor?.name : item.Requester?.name}
          </span>
          <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
            <MapPin className="w-3 h-3" />
            {item.location}
          </span>
          <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
            <Calendar className="w-3 h-3" />
            {new Date(item.date_posted).toLocaleDateString()}
          </span>
          {item.category && (
            <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
              <Package className="w-3 h-3" />
              {item.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const LeaderboardItem = ({ user, rank }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/50 transition-all">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
        rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg' :
        rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-md' :
        rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md' :
        'bg-secondary text-muted-foreground'
      }`}>
        {rank <= 3 ? <Award className="w-5 h-5" /> : rank}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm truncate">{user.username}</h4>
        <p className="text-xs text-muted-foreground truncate">{user.location}</p>
      </div>
      
      <div className="text-right">
        <div className="flex items-center gap-1 text-primary font-bold">
          <Heart className="w-4 h-4" />
          <span>{user.donationCount}</span>
        </div>
        <p className="text-xs text-muted-foreground">donations</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Community Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">
                Track impact, celebrate generosity, inspire change
              </p>
            </div>
            <Sparkles className="w-16 h-16 text-primary animate-pulse hidden md:block" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Gift}
              value={stats.totalDonations}
              label="Total Donations"
              color="from-blue-500 to-purple-600"
              delay="0s"
            />
            <StatCard
              icon={CheckCircle}
              value={stats.claimedDonations}
              label="Items Claimed"
              color="from-green-500 to-emerald-600"
              delay="0.1s"
            />
            <StatCard
              icon={HandHeart}
              value={stats.totalRequests}
              label="Active Requests"
              color="from-orange-500 to-pink-600"
              delay="0.2s"
            />
            <StatCard
              icon={Users}
              value={stats.activeUsers}
              label="Community Members"
              color="from-purple-500 to-pink-600"
              delay="0.3s"
            />
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'donations', label: 'Recent Donations', icon: Gift },
            { id: 'requests', label: 'Recent Requests', icon: HandHeart },
            { id: 'leaderboard', label: 'Top Contributors', icon: Award }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-card hover:bg-accent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && recentItems && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-primary" />
                      Latest Donations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentItems.recentDonations.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No recent donations yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentItems.recentDonations.slice(0, 3).map(donation => (
                          <ActivityItem key={donation.donation_id} item={donation} type="donation" />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HandHeart className="w-5 h-5 text-primary" />
                      Latest Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentItems.recentRequests.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No recent requests yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentItems.recentRequests.slice(0, 3).map(request => (
                          <ActivityItem key={request.request_id} item={request} type="request" />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Donations Tab */}
            {activeTab === 'donations' && recentItems && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-primary" />
                    All Recent Donations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentItems.recentDonations.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No donations available</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentItems.recentDonations.map(donation => (
                        <ActivityItem key={donation.donation_id} item={donation} type="donation" />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && recentItems && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HandHeart className="w-5 h-5 text-primary" />
                    All Recent Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentItems.recentRequests.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No requests available</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentItems.recentRequests.map(request => (
                        <ActivityItem key={request.request_id} item={request} type="request" />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Top Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {leaderboard.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No contributors yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leaderboard.map((user, idx) => (
                        <LeaderboardItem key={user.id} user={user} rank={idx + 1} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="font-bold text-green-600">
                    {stats ? Math.round((stats.claimedDonations / stats.totalDonations) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Avg. per User</span>
                  <span className="font-bold">
                    {stats ? (stats.totalDonations / stats.activeUsers).toFixed(1) : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Active Today</span>
                  <span className="font-bold text-primary flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Live
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Top Contributors Mini */}
            {activeTab !== 'leaderboard' && leaderboard.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Top Contributors
                    </span>
                    <button
                      onClick={() => setActiveTab('leaderboard')}
                      className="text-xs text-primary hover:underline"
                    >
                      View All
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard.slice(0, 3).map((user, idx) => (
                      <LeaderboardItem key={user.id} user={user} rank={idx + 1} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Impact Message */}
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <h3 className="font-bold mb-2 text-green-900 dark:text-green-100">
                  Making a Difference
                </h3>
                <p className="text-sm text-muted-foreground">
                  Together we've helped connect {stats?.claimedDonations || 0} items with those who need them most.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
