import Image from "next/image"
import { Search } from "lucide-react"

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -z-10 w-[400px] h-[400px] bg-gradient-to-br from-orange-400/80 to-orange-300/40 rounded-full blur-xl"></div>

      {/* Header */}
      <header className="mb-16 max-w-3xl">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Belkins Blog</h1>
        <p className="text-lg text-gray-700">
          Discover how to get more deals closed and grow your business, using proven B2B sales tactics backed by 1,000+
          successful campaigns.
        </p>
      </header>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-16">
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium">View all</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50">
            Lead Generation
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50">
            Sales
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50">
            Outreach
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50">
            B2B marketing
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50">
            Reviews
          </button>
        </div>
        <div className="relative w-full md:w-auto min-w-[300px]">
          <input
            type="text"
            placeholder="Search blog posts"
            className="w-full px-4 py-2 border border-gray-200 rounded-full pr-10"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Most Popular Posts */}
      <section>
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Most Popular Posts</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured Post */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=600"
                width={600}
                height={400}
                alt="Cold email response rates illustration"
                className="w-full h-[300px] object-cover bg-blue-500"
              />
              <div className="absolute top-4 right-4 bg-gray-900/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center">
                  <div className="w-1 h-3 bg-white"></div>
                </div>
                10 m
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3">What are B2B cold email response rates? Belkins' 2024 study</h3>
              <p className="text-gray-600 mb-4">
                This study analyzed over 7.5 million client emails sent across 40 industries from March 2023 to February
                2024. Check out our major findings on reply rate benchmarks and the drivers behind them.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="font-medium">Outreach</span>
                <span>•</span>
                <span>9 Oct 2024</span>
              </div>
            </div>
          </div>

          {/* Right column posts */}
          <div className="space-y-6">
            {/* Post 1 */}
            <div className="flex gap-4 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="w-[140px] h-[140px] bg-yellow-100 flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=140&width=140"
                  width={140}
                  height={140}
                  alt="B2B appointment setting costs illustration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="py-4 pr-4 flex-1">
                <h3 className="font-bold mb-2">B2B appointment setting costs and pricing models explained</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-auto">
                  <span className="font-medium">Sales</span>
                  <span>•</span>
                  <span>15 Jan 2024</span>
                  <span>•</span>
                  <span>13 m</span>
                </div>
              </div>
            </div>

            {/* Post 2 */}
            <div className="flex gap-4 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="w-[140px] h-[140px] bg-orange-500 flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=140&width=140"
                  width={140}
                  height={140}
                  alt="B2B lead generation funnel illustration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="py-4 pr-4 flex-1">
                <h3 className="font-bold mb-2">How to create a B2B lead generation funnel (examples included)</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-auto">
                  <span className="font-medium">Lead generation</span>
                  <span>•</span>
                  <span>30 May 2023</span>
                  <span>•</span>
                  <span>14 m</span>
                </div>
              </div>
            </div>

            {/* Post 3 */}
            <div className="flex gap-4 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="w-[140px] h-[140px] bg-green-100 flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=140&width=140"
                  width={140}
                  height={140}
                  alt="Outsource appointment setting illustration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="py-4 pr-4 flex-1">
                <h3 className="font-bold mb-2">How to outsource appointment setting to a company</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-auto">
                  <span className="font-medium">Sales</span>
                  <span>•</span>
                  <span>19 Mar 2023</span>
                  <span>•</span>
                  <span>11 m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
