import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, Home } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    // TODO: Submit to backend
    setEmail('');
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-[1280px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-8" onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); }}>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Home className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-foreground">
                Aavasa
              </span>
            </Link>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground mb-6">
              AI-powered luxury real estate platform connecting you with your dream home through intelligent matching and personalized recommendations.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: 'https://facebook.com' },
                { icon: Twitter, href: 'https://twitter.com' },
                { icon: Instagram, href: 'https://instagram.com' },
                { icon: Linkedin, href: 'https://linkedin.com' },
                { icon: Youtube, href: 'https://youtube.com' },
              ].map(({ icon: IconComp, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-muted/50 border border-border rounded-lg flex items-center justify-center transition-colors group"
                >
                  <IconComp className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-primary-foreground mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/properties', label: 'Browse Properties' },
                { to: '/ai-hub', label: 'AI Property Hub' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { href: '#', label: 'Careers' },
                { href: '#', label: 'Blog' },
              ].map((item) => (
                <li key={item.to ?? item.label}>
                  <a
                    href={item.to ?? item.label}
                    className="text-sm text-muted-foreground hover:text-primary-foreground hover:pl-1 transition-colors inline-block"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Column */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-primary-foreground mb-6">
              Contact Info
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  502, Devpath Building,<br />
                  Near Torrent Lab,<br />
                  Ashram Road, Ahmedabad
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-primary" />
                <a href="tel:+919876543210" className="text-sm text-muted-foreground hover:text-primary-foreground transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-primary" />
                <a href="mailto:hello@buildestate.com" className="text-sm text-muted-foreground hover:text-primary-foreground transition-colors">
                  hello@buildestate.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-primary-foreground mb-6">
              Stay Updated
            </h4>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Subscribe to our newsletter for the latest listings, market insights, and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-primary-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary transition-colors"
                required
              />
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold px-4 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-muted-foreground/70 mt-3">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2026 Aavasa. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                'Privacy Policy',
                'Terms of Service',
                'Cookie Policy',
                'Sitemap',
              ].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary-foreground transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;