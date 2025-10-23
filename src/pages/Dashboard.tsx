import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboardApi, DashboardStats, RecentItemsResponse } from '@/utils/api';
import { toast } from 'sonner';
import { LayoutDashboard, Gift, CheckCircle, HandHeart, Users, Calendar, MapPin, User } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentItems, setRecentItems] = useState<RecentItemsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const [statsData, recentData] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecent(),
      ]);
      setStats(statsData);
      setRecentItems(recentData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            <LayoutDashboard className="w-8 h-8 inline mr-2" />
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">Track the impact of our community</p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : (
          <>
            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="shadow-soft hover:shadow-medium transition-all hover:scale-105 animate-fade-in">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <Gift className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">{stats.totalDonations}</div>
                    <div className="text-sm text-muted-foreground">Total Donations</div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft hover:shadow-medium transition-all hover:scale-105 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2">{stats.claimedDonations}</div>
                    <div className="text-sm text-muted-foreground">Claimed Items</div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft hover:shadow-medium transition-all hover:scale-105 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 mb-4">
                      <HandHeart className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.totalRequests}</div>
                    <div className="text-sm text-muted-foreground">Active Requests</div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft hover:shadow-medium transition-all hover:scale-105 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4">
                      <Users className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="text-3xl font-bold text-red-600 mb-2">{stats.activeUsers}</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Donations */}
            {recentItems && (
              <>
                <Card className="mb-8 shadow-soft animate-fade-in">
                  <CardHeader>
                    <CardTitle>
                      <Gift className="w-5 h-5 inline mr-2" />
                      Recent Donations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentItems.recentDonations.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No recent donations</p>
                    ) : (
                      <div className="space-y-4">
                        {recentItems.recentDonations.map(donation => (
                          <div key={donation.donation_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-all">
                            <div className="flex-1">
                              <h4 className="font-semibold">{donation.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center">
                                  <User className="w-3 h-3 mr-1" />
                                  {donation.Donor?.name}
                                </span>
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {donation.location}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(donation.date_posted).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Badge variant={donation.status === 'Available' ? 'default' : 'secondary'}>
                              {donation.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Requests */}
                <Card className="shadow-soft animate-fade-in">
                  <CardHeader>
                    <CardTitle>
                      <HandHeart className="w-5 h-5 inline mr-2" />
                      Recent Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentItems.recentRequests.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No recent requests</p>
                    ) : (
                      <div className="space-y-4">
                        {recentItems.recentRequests.map(request => (
                          <div key={request.request_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-all">
                            <div className="flex-1">
                              <h4 className="font-semibold">{request.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center">
                                  <User className="w-3 h-3 mr-1" />
                                  {request.Requester?.name}
                                </span>
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {request.location}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(request.date_posted).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Badge variant={request.status === 'Active' ? 'default' : 'secondary'}>
                              {request.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
