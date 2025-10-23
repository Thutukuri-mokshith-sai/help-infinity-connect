import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser, getAllUsers, getDonations, addNotification } from '@/utils/storage';
import { User } from '@/types';
import { Award, Download, Trophy, Star, Medal, Crown, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Certificates = () => {
  const navigate = useNavigate();
  const [topDonors, setTopDonors] = useState<User[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view certificates');
      navigate('/auth');
      return;
    }
    loadTopDonors();
  }, [user, navigate]);

  const loadTopDonors = () => {
    if (!user) return;

    const donations = getDonations();
    const users = getAllUsers();

    // Count donations per user
    const donationCounts = donations.reduce((acc, donation) => {
      acc[donation.donorId] = (acc[donation.donorId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Update user donation counts and sort
    const usersWithCounts = users.map(u => ({
      ...u,
      donationCount: donationCounts[u.id] || 0,
    })).sort((a, b) => b.donationCount - a.donationCount);

    setTopDonors(usersWithCounts.slice(0, 10));
    
    const rank = usersWithCounts.findIndex(u => u.id === user.id);
    setUserRank(rank + 1);
  };

  const getTierInfo = (rank: number) => {
    if (rank === 1) return { name: 'Platinum', icon: Crown, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' };
    if (rank === 2) return { name: 'Gold', icon: Trophy, color: 'text-amber-500', bgColor: 'bg-amber-500/10' };
    if (rank === 3) return { name: 'Silver', icon: Medal, color: 'text-slate-400', bgColor: 'bg-slate-400/10' };
    if (rank <= 10) return { name: 'Bronze', icon: Star, color: 'text-orange-600', bgColor: 'bg-orange-600/10' };
    return { name: 'Supporter', icon: Sparkles, color: 'text-primary', bgColor: 'bg-primary/10' };
  };

  const generateCertificate = (donor: User, rank: number) => {
    const tier = getTierInfo(rank);
    
    // Create certificate notification
    addNotification({
      id: Date.now().toString(),
      type: 'certificate',
      message: `🎉 Congratulations! You've earned a ${tier.name} tier certificate for being #${rank} top donor!`,
      timestamp: new Date().toISOString(),
      read: false,
      userId: donor.id,
    });

    toast.success('Certificate generated! Check your notifications.');
  };

  if (!user) return null;

  const userTier = getTierInfo(userRank);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            <Award className="w-8 h-8 inline mr-2" />
            Donor Certificates
          </h1>
          <p className="text-muted-foreground">Recognize our generous community members</p>
        </div>

        {/* User's Certificate */}
        {user.donationCount > 0 && (
          <Card className="mb-8 overflow-hidden shadow-strong animate-fade-in">
            <div className="bg-gradient-primary p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
              
              <div className="relative z-10 text-center">
                <div className="flex justify-center mb-4">
                  <div className={`p-6 rounded-full ${userTier.bgColor} ${userTier.color}`}>
                    <userTier.icon className="w-16 h-16" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold mb-2">Certificate of Appreciation</h2>
                <div className="w-32 h-1 bg-white/30 mx-auto mb-6"></div>
                
                <p className="text-xl mb-2">This certifies that</p>
                <p className="text-4xl font-bold mb-6">{user.username}</p>
                
                <p className="text-lg mb-2">Has generously donated</p>
                <p className="text-5xl font-bold mb-6">{user.donationCount}</p>
                <p className="text-lg mb-6">item{user.donationCount !== 1 ? 's' : ''} to the community</p>
                
                <Badge className={`${userTier.bgColor} ${userTier.color} text-lg px-6 py-2 mb-6`}>
                  {userTier.name} Tier - Rank #{userRank}
                </Badge>
                
                <p className="text-sm opacity-80 mb-4">
                  Issued on {new Date().toLocaleDateString()}
                </p>
                
                <Button
                  variant="secondary"
                  onClick={() => generateCertificate(user, userRank)}
                  className="mt-4"
                >
                  <Download className="w-4 h-4" />
                  Save Certificate
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Leaderboard */}
        <Card className="shadow-soft animate-fade-in">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-primary" />
              Top Donors Leaderboard
            </h3>
            
            <div className="space-y-3">
              {topDonors.map((donor, index) => {
                const tier = getTierInfo(index + 1);
                const isCurrentUser = donor.id === user.id;
                
                return (
                  <div
                    key={donor.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                      isCurrentUser 
                        ? 'bg-primary/10 border-2 border-primary' 
                        : 'bg-secondary/50 hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${tier.bgColor}`}>
                        <tier.icon className={`w-6 h-6 ${tier.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">#{index + 1}</span>
                          <span className="font-semibold">{donor.username}</span>
                          {isCurrentUser && (
                            <Badge variant="default">You</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{donor.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {donor.donationCount}
                      </div>
                      <p className="text-sm text-muted-foreground">donations</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {user.donationCount === 0 && (
          <Card className="mt-8 p-8 text-center animate-fade-in">
            <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
            <p className="text-muted-foreground mb-4">
              Make your first donation to earn a certificate and join the leaderboard!
            </p>
            <Button onClick={() => navigate('/donate')}>
              <Award className="w-4 h-4" />
              Donate Now
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Certificates;
