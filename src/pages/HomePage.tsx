import React from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { SocialFeed } from "../components/social/SocialFeed";
import { useAuth } from "../hooks/useAuth";

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      title: "Guided Meditations",
      description:
        "Expert-crafted sessions for every experience level and intention",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
      ),
      title: "Social Community",
      description:
        "Connect with fellow practitioners and share your meditation journey",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: "Progress Tracking",
      description:
        "Visualize your growth with detailed analytics and achievements",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
          />
        </svg>
      ),
      title: "QR Connect",
      description: "Instantly connect with nearby meditators using QR codes",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-deepTeal/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-deepTeal/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sage-300/20 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="secondary" className="mb-6">
              🦋 Transform Your Mind
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-sage-900 mb-6 leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-deepTeal to-sage-600 bg-clip-text text-transparent">
                Chrysalis
              </span>
            </h1>

            <p className="text-xl text-sage-600 mb-8 max-w-2xl mx-auto">
              Transform your mental wellbeing through guided meditation, social
              connection, and mindful practice. Begin your journey of personal
              growth today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Button
                  size="lg"
                  className="text-lg px-8 py-4"
                  onClick={() => (window.location.href = "/meditate")}
                >
                  Continue Your Journey
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="text-lg px-8 py-4"
                    onClick={() => (window.location.href = "/auth")}
                  >
                    Start Meditating
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-4"
                    onClick={() => (window.location.href = "/auth")}
                  >
                    Learn More
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-sage-900 mb-4">
              Everything You Need for Mindful Practice
            </h2>
            <p className="text-sage-600 max-w-2xl mx-auto">
              Chrysalis provides a complete ecosystem for meditation and
              mindfulness, designed to support your transformation at every
              step.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="w-12 h-12 mx-auto bg-deepTeal/10 rounded-xl flex items-center justify-center text-deepTeal mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-sage-900 mb-12">
              Join Our Growing Community
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-deepTeal mb-2">
                  10K+
                </div>
                <div className="text-sage-600">Active Meditators</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-deepTeal mb-2">
                  50K+
                </div>
                <div className="text-sage-600">Sessions Completed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-deepTeal mb-2">95%</div>
                <div className="text-sage-600">Report Better Sleep</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Feed Section - for authenticated users */}
      {isAuthenticated && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-sage-900 mb-8 text-center">
                Community Highlights
              </h2>
              <p className="text-sage-600 text-center mb-12 max-w-2xl mx-auto">
                See what fellow meditators are sharing about their journey
              </p>
              <div className="max-w-2xl mx-auto">
                <SocialFeed />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 bg-gradient-to-r from-deepTeal to-sage-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Mind?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Begin your meditation journey today with personalized sessions,
                community support, and powerful progress tracking.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="text-lg px-8 py-4"
                onClick={() => (window.location.href = "/auth")}
              >
                Start Your Free Journey
              </Button>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
