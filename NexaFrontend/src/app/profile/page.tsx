import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Profile
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            View your DAO memberships, voting history, and governance activity.
          </p>
          <div className="bg-purple-50 p-8 rounded-lg">
            <p className="text-gray-600">
              🚧 This page is under construction. The user profile dashboard will be implemented next.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}