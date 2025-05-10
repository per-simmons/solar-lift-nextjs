import Image from "next/image"
import { Clock, Calendar } from "lucide-react"

export default function CaseStudy() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* White header section */}
      <div className="bg-white w-full pb-16">
        <div className="container mx-auto px-4 md:px-8 pt-6">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/placeholder.svg?height=50&width=100"
              alt="IGS Logo"
              width={100}
              height={50}
              className="h-12 w-auto"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
            <div>
              {/* Lead text in accent color */}
              <p className="text-[#ffce01] font-medium mb-2 uppercase tracking-wide">
                LEAD GENERATION FOR FIRED HEATER SERVICE PROVIDER
              </p>

              {/* Main headline */}
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-8">
                Email outreach soars to 3rd place among 20 channels for an integrity and efficiency service provider
              </h1>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-4xl md:text-5xl font-bold text-[#ffce01]">330</p>
                  <p className="text-sm text-gray-600">Booked appointments in 15 months</p>
                </div>
                <div>
                  <p className="text-4xl md:text-5xl font-bold text-[#ffce01]">120%</p>
                  <p className="text-sm text-gray-600">Avg. monthly KPIs</p>
                </div>
              </div>
            </div>

            {/* Header image */}
            <div className="relative h-[300px] md:h-[400px]">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="IGS workers in the field"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Company details in 4 columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <p className="font-semibold text-sm">Category</p>
              <p className="text-sm">Appointment Setting</p>
            </div>
            <div>
              <p className="font-semibold text-sm">Industry</p>
              <p className="text-sm">Environmental</p>
            </div>
            <div>
              <p className="font-semibold text-sm">Headquarters</p>
              <p className="text-sm">Richmond, VA</p>
            </div>
            <div>
              <p className="font-semibold text-sm">Company size</p>
              <p className="text-sm">201-500 employees</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gray content section */}
      <div className="bg-gray-100 flex-grow pt-16 pb-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main content - 2/3 width */}
            <div className="md:col-span-2">
              <p className="text-gray-700 mb-12">
                IGS is a game-changer in the energy sector, helping Fortune 500 companies drive sustainable growth while
                reducing their carbon footprints. With innovative and robotic solutions, IGS is transforming asset
                inspection and preservation, while also delivering significant environmental and operational
                efficiencies. These solutions extend asset life and cut fuel consumption and emissions, saving IGS'
                customers millions annually.
              </p>

              <h2 className="text-2xl font-bold mt-16 mb-6">Challenges</h2>
              <p className="text-gray-700 mb-12">
                The client needed to boost their lead-to-appointment conversions. Despite having a strong online
                presence and over 20 marketing channels at their disposal, they needed to streamline their campaign
                management and weed through vast volumes of leads. Their global business development and subject-matter
                expert team needed a steady flow of high-quality meetings tailored to various regions.
              </p>

              <h2 className="text-2xl font-bold mt-16 mb-6">Solutions</h2>
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="md:col-span-1">
              {/* Reading time and publish date */}
              <div className="mb-8">
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Reading duration</span>
                  <span className="ml-auto text-sm">10 min</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Published</span>
                  <span className="ml-auto text-sm">19 May 2024</span>
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">Want 100+ qualified appointments yearly?</h3>
                <p className="text-sm mb-4">Let's map your winning lead generation strategy.</p>
                <button className="bg-[#ffce01] hover:bg-[#e6b900] text-black font-medium py-2 px-4 rounded">
                  Get a quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
