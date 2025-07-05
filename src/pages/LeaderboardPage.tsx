import React from "react";
import { Layout } from "../components/common/Layout";
import { Leaderboard } from "../components/leaderboard/Leaderboard";
import { Trophy, TrendingUp, Award, Users } from "lucide-react";
import { Card } from "../components/ui/Card";

const LeaderboardPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-warmGold to-amber-500 rounded-2xl flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-sage-900 mb-2">
              Leaderboard
            </h1>
            <p className="text-sage-600">
              See how you rank among our meditation community
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-warmGold/10 rounded-lg flex items-center justify-center mb-2">
                  <Trophy className="w-5 h-5 text-warmGold" />
                </div>
                <p className="text-sm text-sage-600">Top Meditator</p>
                <p className="font-semibold text-sage-900">2,480 min</p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-deepTeal/10 rounded-lg flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-deepTeal" />
                </div>
                <p className="text-sm text-sage-600">Avg Weekly</p>
                <p className="font-semibold text-sage-900">347 min</p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-sage-100 rounded-lg flex items-center justify-center mb-2">
                  <Award className="w-5 h-5 text-sage-600" />
                </div>
                <p className="text-sm text-sage-600">Top Streak</p>
                <p className="font-semibold text-sage-900">28 days</p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-sm text-sage-600">Active Users</p>
                <p className="font-semibold text-sage-900">1,247</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Leaderboard */}
        <Leaderboard />

        {/* Motivation Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-sage-50 to-deepTeal/5 rounded-2xl p-8 border border-sage-200">
            <h2 className="text-xl font-semibold text-sage-900 mb-4">
              🧘‍♀️ Every moment of mindfulness counts
            </h2>
            <p className="text-sage-600 max-w-2xl mx-auto">
              Our leaderboard celebrates consistency and dedication, not just
              duration. Whether you meditate for 5 minutes or 50, every session
              brings you closer to inner peace.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaderboardPage;
