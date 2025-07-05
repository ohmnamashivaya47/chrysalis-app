import React from "react";
import { Layout } from "../components/common/Layout";
import { SocialFeed } from "../components/social/SocialFeed";
import { Button } from "../components/ui/Button";
import { Plus, Users, TrendingUp } from "lucide-react";

const SocialPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-sage-900 mb-2">
                Community
              </h1>
              <p className="text-sage-600">
                Connect with fellow meditators and share your journey
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Share Your Journey
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-sage-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-sage-600" />
                </div>
                <div>
                  <p className="text-sm text-sage-600">Active Members</p>
                  <p className="text-lg font-semibold text-sage-900">1,247</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-sage-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-deepTeal/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-deepTeal" />
                </div>
                <div>
                  <p className="text-sm text-sage-600">Sessions Today</p>
                  <p className="text-lg font-semibold text-sage-900">892</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-sage-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warmGold/10 rounded-lg flex items-center justify-center">
                  <span className="text-warmGold font-semibold">✨</span>
                </div>
                <div>
                  <p className="text-sm text-sage-600">Insights Shared</p>
                  <p className="text-lg font-semibold text-sage-900">156</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Feed */}
        <SocialFeed />
      </div>
    </Layout>
  );
};

export default SocialPage;
