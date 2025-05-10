import Image from "next/image"
import Link from "next/link"
import { Facebook, Linkedin, Twitter, Link2 } from "lucide-react"

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with different background color */}
      <div className="bg-gray-50 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/blog" className="hover:text-gray-700">
              Blog
            </Link>
            <span className="mx-2">›</span>
            <Link href="/blog/sales" className="hover:text-gray-700">
              Sales
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Title and author section */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                How to outsource appointment setting to a company
              </h1>

              <div className="flex items-center mb-4">
                <Image
                  src="/placeholder.svg?height=48&width=48"
                  alt="Author"
                  width={48}
                  height={48}
                  className="rounded-full mr-4"
                />
                <div>
                  <div className="text-sm text-gray-500">Author</div>
                  <div className="font-medium">Precious Oboidhe</div>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <span>Updated: 2023-03-20</span>
                <span className="mx-2">•</span>
                <span>Reading time: 11 m</span>
              </div>
            </div>

            {/* Featured image */}
            <div className="relative">
              <Image
                src="/placeholder.svg?height=300&width=500"
                alt="Blog post featured image"
                width={500}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contents sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-8">
              <h2 className="text-2xl font-bold mb-4">Contents</h2>
              <nav className="space-y-4">
                <a href="#intro" className="block text-gray-700 hover:text-gray-900 font-medium">
                  Introduction
                </a>
                <a href="#what-businesses-want" className="block text-gray-700 hover:text-gray-900 font-medium">
                  What businesses want when they outsource
                </a>
                <a href="#challenges" className="block text-gray-700 hover:text-gray-900 font-medium">
                  The challenges and regrets
                </a>
                <a href="#success" className="block text-gray-700 hover:text-gray-900 font-medium">
                  How success looks
                </a>
                <a href="#learnings" className="block text-gray-700 hover:text-gray-900 font-medium">
                  Learnings from our customers
                </a>
                <a href="#factors" className="block text-gray-700 hover:text-gray-900 font-medium">
                  5 factors to consider
                </a>
                <a href="#conclusion" className="block text-gray-700 hover:text-gray-900 font-medium">
                  Conclusion
                </a>
              </nav>
            </div>
          </div>

          {/* Blog content */}
          <div className="lg:col-span-7">
            <article className="prose prose-lg max-w-none">
              <div id="intro">
                <p>
                  In 5+ years of running our <a href="#">B2B lead generation company</a>, we've worked with over 1000
                  brands in several industries like SaaS, consulting, cyber security, solar energy, and financial
                  services.
                </p>
                <p>
                  From our experiences and innumerable conversations with businesses who work with appointment setting
                  companies, we've understood:
                </p>
              </div>

              <ul id="what-businesses-want">
                <li>What businesses want when they outsource appointment setting</li>
                <li>The challenges and regrets of businesses that got subpar results</li>
                <li>How success with an appointment setting company looks</li>
              </ul>

              <div id="learnings">
                <p>
                  Learnings from our customers — especially those who switched from other appointment-setting companies
                  — show that many agencies don't deliver satisfactory results. They often provide inadequate leads,
                  resulting in too few opportunities to close.
                </p>
                <p>
                  Besides the wasted time and lost leads, customers lose between $20,000 to $50,000 depending on the
                  length of their contract with a vendor. No one, absolutely no one, should ever go through this ordeal.
                </p>
              </div>

              <div id="factors">
                <p>
                  To help you outsource appointment setting to the right company, here are 5 factors you should consider
                  before working with one:
                </p>

                <ol>
                  <li>Do they have industry expertise?</li>
                  <li>Are they transparent in their operations?</li>
                  <li>Do they have irrefutable social proof?</li>
                  <li>Are they specialists in appointment setting?</li>
                  <li>Do they have a clear sales process?</li>
                </ol>
              </div>

              <div id="conclusion">
                <p>Below, we'll explain each factor and discuss how our B2B lead generation company addresses them.</p>
              </div>
            </article>
          </div>

          {/* Share buttons (moved to the right) */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <div className="text-gray-500 mb-4 text-sm font-medium">SHARE</div>
              <div className="flex flex-col space-y-4">
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <Linkedin className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <Facebook className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <Twitter className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <Link2 className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
