export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Contact Header Section */}
      <section className="bg-gradient-to-b from-[#2b3a4a] to-[#475b6f] text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">Contact Us</h1>
        <p className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed">
          Experience the ultimate chill. Our expert engineering team is standing by to<br className="hidden md:block" />
          restore your vehicle's performance and comfort.
        </p>
      </section>
      
      {/* Rest of the page content can go here */}
      <div className="flex-1 p-4 md:p-12 lg:p-16 bg-gray-50 flex justify-center items-start -mt-8 relative z-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          
          {/* Left Column: Form */}
          <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 lg:col-span-3 transform hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-2xl font-bold text-[#14304b] mb-6">Send Us a Message</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-500 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:ring-0 rounded-lg py-3 px-4 text-gray-700 outline-none transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="john@example.com"
                    className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:ring-0 rounded-lg py-3 px-4 text-gray-700 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-500 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="(555) 000-0000"
                  className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:ring-0 rounded-lg py-3 px-4 text-gray-700 outline-none transition-colors"
                />
              </div>

              {/* Your Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-500 mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="How can we help you today?"
                  className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:ring-0 rounded-lg py-3 px-4 text-gray-700 outline-none transition-colors resize-y"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="bg-[#0b355e] hover:bg-[#082a4d] text-white font-medium py-3 px-8 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Contact Info */}
          <div className="bg-[#042f56] text-white rounded-xl shadow-sm p-8 md:p-10 lg:col-span-2 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>
              
              <div className="space-y-8">
                {/* Location */}
                <div className="flex items-start">
                  <div className="bg-white text-[#042f56] p-3 rounded-full mr-4 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-sm text-blue-200 mb-1">Location</h3>
                    <p className="text-white text-md">123 Luxury Lane, Auto City, ST 12345</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <div className="bg-white text-[#042f56] p-3 rounded-full mr-4 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-sm text-blue-200 mb-1">Phone</h3>
                    <p className="text-white text-md">(555) 123-4567</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <div className="bg-white text-[#042f56] p-3 rounded-full mr-4 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-sm text-blue-200 mb-1">Email</h3>
                    <p className="text-white text-md">info@cooldrive.com</p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start">
                  <div className="bg-white text-[#042f56] p-3 rounded-full mr-4 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-sm text-blue-200 mb-1">Working Hours</h3>
                    <p className="text-white text-md">Mon - Sat: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <hr className="border-[#174676] my-8" />
              <h3 className="text-sm text-white mb-4">Follow Our Updates</h3>
              <div className="flex gap-4">
                {/* Facebook */}
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#174676] hover:bg-[#174676] transition-colors" aria-label="Facebook">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                </a>
                {/* X (Twitter) */}
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#174676] hover:bg-[#174676] transition-colors" aria-label="X (Twitter)">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
                </a>
                {/* TikTok */}
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#174676] hover:bg-[#174676] transition-colors" aria-label="TikTok">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </a>
                {/* YouTube */}
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#174676] hover:bg-[#174676] transition-colors" aria-label="YouTube">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3 3 0 00-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3 3 0 00-2.122 2.136C0 8.055 0 12 0 12s0 3.945.501 5.814a3 3 0 002.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3 3 0 002.122-2.136C24 15.945 24 12 24 12s0-3.945-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
