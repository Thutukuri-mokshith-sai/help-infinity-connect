import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDonations, getRequests, getAllUsers } from '@/utils/storage';
import { Donation, Request } from '@/types';
import { Gift, CheckCircle, HandHeart, Users, LayoutDashboard, MapPin, User, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    setDonations(getDonations());
    setRequests(getRequests());
    setTotalUsers(getAllUsers().length);
  }, []);

  const claimedCount = donations.filter(d => d.status === 'Claimed').length;

  const stats = [
    {
      icon: Gift,
      label: 'Total Donations',
      value: donations.length,
      color: 'text-primary',
    },
    {
      icon: CheckCircle,
      label: 'Claimed Items',
      value: claimedCount,
      color: 'text-success',
    },
    {
      icon: HandHeart,
      label: 'Active Requests',
      value: requests.length,
      color: 'text-warning',
    },
    {
      icon: Users,
      label: 'Active Users',
      value: totalUsers,
      color: 'text-destructive',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            <LayoutDashboard className="w-8 h-8 inline mr-2" />
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">Track the community's impact in real-time</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="text-center hover:shadow-medium transition-all hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Donations */}
        <Card className="mb-8 shadow-soft animate-fade-in">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Gift className="w-5 h-5 mr-2 text-primary" />
              Recent Donations
            </h3>
            {donations.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No donations yet</p>
            ) : (
              <div className="space-y-3">
                {donations.slice(0, 5).map(donation => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{donation.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center">
                          <Badge variant="outline" className="mr-2">{donation.category}</Badge>
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {donation.location}
                        </span>
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {donation.donor}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(donation.date).toLocaleDateString()}
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
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <HandHeart className="w-5 h-5 mr-2 text-primary" />
              Recent Requests
            </h3>
            {requests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No requests yet</p>
            ) : (
              <div className="space-y-3">
                {requests.slice(0, 5).map(request => (
                  <div
                    key={request.id}
                    className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth"
                  >
                    <h4 className="font-semibold">{request.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center">
                        <Badge variant="outline" className="mr-2">{request.category}</Badge>
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {request.location}
                      </span>
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {request.requester}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(request.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
