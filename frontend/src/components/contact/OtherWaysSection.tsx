import React from 'react';

interface ContactMethod {
  icon: string;
  title: string;
  description: string;
  action: string;
  actionLink: string;
  bgColor: string;
}

const OtherWaysSection: React.FC = () => {
  const methods: ContactMethod[] = [
    {
      icon: 'chat',
      title: 'WhatsApp Us',
      description: 'Chat directly with our support team via WhatsApp for instant assistance.',
      action: 'Start Chat',
      actionLink: 'https://wa.me/919876543210',
      bgColor: 'bg-[#eaf5f0]'
    },
    {
      icon: 'chat_bubble',
      title: 'Email Support',
      description: 'Send us your questions and our team will respond as soon as possible.',
      action: 'Send an Email',
      actionLink: 'mailto:koyyanarahul4002@gmail.com',
      bgColor: 'bg-[#ecf2f7]'
    },
    {
      icon: 'event',
      title: 'Call the Team',
      description: 'Speak with a property expert about your next move.',
      action: 'Call Now',
      actionLink: 'tel:+919876543210',
      bgColor: 'bg-[#fbf4e8]'
    }
  ];

  return (
    <section className="bg-[#f7f5f0] py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-syne font-bold text-4xl text-[#253247] mb-4">
            Other Ways to Connect
          </h2>
          <p className="font-manrope text-lg text-[#253247] leading-relaxed max-w-[640px] mx-auto">
            Need faster support? Try our instant messaging options.
          </p>
        </div>

        {/* Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {methods.map((method, index) => (
            <div 
              key={index}
              className="bg-white border border-[#e5e7eb] rounded-2xl p-8 hover:shadow-xl transition-all group"
            >
              {/* Icon */}
              <div className={`w-16 h-16 ${method.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <span className="material-icons text-3xl text-[#142c4e]">
                  {method.icon}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-syne font-bold text-xl text-[#253247] mb-3">
                {method.title}
              </h3>

              {/* Description */}
              <p className="font-manrope font-extralight text-sm text-[#253247] leading-relaxed mb-6">
                {method.description}
              </p>

              {/* Action Link */}
              <a 
                href={method.actionLink}
                target={method.actionLink.startsWith('http') ? '_blank' : '_self'}
                rel={method.actionLink.startsWith('http') ? 'noopener noreferrer' : ''}
                className="inline-flex items-center gap-2 font-manrope font-bold text-sm text-[#142c4e] hover:text-[#142c4e] transition-[color] group"
              >
                <span>{method.action}</span>
                <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherWaysSection;