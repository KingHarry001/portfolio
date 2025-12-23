import { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Calendar,
  ExternalLink,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Clock,
  Globe,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

const personalInfo = {
  email: "nexus.dynasty.org@gmail.com",
  phone: "+234 903 816 3213",
  location: "Lagos, Nigeria",
};

const socialLinks = {
  github: "https://github.com/",
  linkedin: "https://linkedin.com/",
  instagram: "https://instagram.com/",
  twitter: "https://twitter.com/",
};

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [formErrors, setFormErrors] = useState({});

  const sectionRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    
    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCalendarBooking = () => {
    setIsBookingOpen(true);
    // Simulate calendar booking
    setTimeout(() => {
      setIsBookingOpen(false);
      alert("Calendar booking would open here - integration with Calendly, etc.");
    }, 1500);
  };

  const socialPlatforms = [
    { name: "GitHub", url: socialLinks.github, icon: <Github size={24} />, color: "hover:text-gray-300" },
    { name: "LinkedIn", url: socialLinks.linkedin, icon: <Linkedin size={24} />, color: "hover:text-blue-400" },
    { name: "Instagram", url: socialLinks.instagram, icon: <Instagram size={24} />, color: "hover:text-pink-400" },
    { name: "Twitter", url: socialLinks.twitter, icon: <Twitter size={24} />, color: "hover:text-cyan-400" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { name, email, company, service, message } = formData;

      // Format message for WhatsApp
      const formattedMessage = `🚀 New Project Inquiry

👤 Name: ${name}
📧 Email: ${email}
🏢 Company: ${company || "N/A"}
🛠️ Service: ${service || "General Inquiry"}

💬 Message:
${message}

---
Sent from Portfolio Contact Form`;

      const encodedMessage = encodeURIComponent(formattedMessage);
      const phoneNumber = "2349038163213";
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      
      // Open WhatsApp
      window.open(whatsappURL, "_blank");
      
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          company: "",
          service: "",
          message: "",
        });
        setSubmitStatus(null);
      }, 3000);

    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation setup
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(60px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .contact-card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .contact-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px -12px rgba(0, 255, 209, 0.3);
        }
        
        .social-link {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .social-link:hover {
          transform: translateY(-8px) rotate(5deg) scale(1.1);
          box-shadow: 0 15px 30px -8px rgba(0, 255, 209, 0.4);
        }
        
        .form-input {
          transition: all 0.3s ease;
        }
        
        .form-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px -8px rgba(0, 255, 209, 0.4);
        }
        
        .floating-icon {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
        
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(0, 255, 209, 0.3); }
          50% { border-color: rgba(0, 255, 209, 0.8); }
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #00FFD1, #00A8CC, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      
      <section ref={sectionRef} id="contact" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,255,209,0.1),transparent)]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-20 animate-on-scroll">
            <h2 className="text-6xl font-bold text-white mb-6">
              Let's{" "}
              <span className="gradient-text">
                Connect
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Ready to bring your digital vision to life? Let's discuss how I can
              help your project succeed with cutting-edge design and development.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
                <h3 className="text-3xl font-bold text-white mb-6">
                  Get in Touch
                </h3>
                <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                  I'm always excited to work on new projects and collaborate with
                  innovative teams. Whether you need design, development, or
                  security consulting, I'm here to help turn your ideas into reality.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                <div className="contact-card animate-on-scroll flex items-start gap-4 p-5 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:border-cyan-400/50 transition-all duration-300" style={{ transitionDelay: '0.2s' }}>
                  <div className="p-3 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
                    <Mail size={24} className="text-cyan-400 floating-icon" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">Email</h4>
                    <p className="text-slate-300 font-medium">{personalInfo.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock size={14} className="text-slate-400" />
                      <p className="text-sm text-slate-400">Response within 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="contact-card animate-on-scroll flex items-start gap-4 p-5 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:border-cyan-400/50 transition-all duration-300" style={{ transitionDelay: '0.3s' }}>
                  <div className="p-3 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
                    <Phone size={24} className="text-cyan-400 floating-icon" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">Phone</h4>
                    <p className="text-slate-300 font-medium">{personalInfo.phone}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock size={14} className="text-slate-400" />
                      <p className="text-sm text-slate-400">Available 9 AM - 6 PM WAT</p>
                    </div>
                  </div>
                </div>

                <div className="contact-card animate-on-scroll flex items-start gap-4 p-5 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:border-cyan-400/50 transition-all duration-300" style={{ transitionDelay: '0.4s' }}>
                  <div className="p-3 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
                    <MapPin size={24} className="text-cyan-400 floating-icon" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">Location</h4>
                    <p className="text-slate-300 font-medium">{personalInfo.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Globe size={14} className="text-slate-400" />
                      <p className="text-sm text-slate-400">Open to remote collaboration</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Calendar Booking */}
              <div className="animate-on-scroll p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl pulse-border" style={{ transitionDelay: '0.5s' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Calendar className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h4 className="text-2xl font-semibold text-white">
                    Schedule a Call
                  </h4>
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Prefer to talk directly? Book a 30-minute consultation call to
                  discuss your project requirements and explore how we can work together.
                </p>
                <button
                  onClick={handleCalendarBooking}
                  disabled={isBookingOpen}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-3 group transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                >
                  {isBookingOpen ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Calendar size={20} />
                  )}
                  {isBookingOpen ? "Opening Calendar..." : "Book Free Consultation"}
                  <ExternalLink
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </button>
              </div>

              {/* Social Links */}
              <div className="animate-on-scroll" style={{ transitionDelay: '0.6s' }}>
                <h4 className="text-white font-semibold mb-6 text-xl">
                  Follow My Work
                </h4>
                <div className="flex gap-4">
                  {socialPlatforms.map((platform, index) => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`social-link p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:border-cyan-400/50 transition-all duration-300 group ${platform.color}`}
                      title={platform.name}
                      style={{ transitionDelay: `${0.1 * index}s` }}
                    >
                      <span className="text-slate-300 group-hover:scale-110 transition-transform duration-300 inline-block">
                        {platform.icon}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-on-scroll bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl" style={{ transitionDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="w-8 h-8 text-cyan-400" />
                <h3 className="text-3xl font-bold text-white">
                  Send a Message
                </h3>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-400/30 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-green-400 font-medium">Message sent successfully!</p>
                    <p className="text-green-300 text-sm">Opening WhatsApp to continue the conversation...</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-red-400 font-medium">Please check the form for errors</p>
                    <p className="text-red-300 text-sm">Make sure all required fields are filled correctly.</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white font-medium mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`form-input w-full p-4 bg-slate-700/50 border ${formErrors.name ? 'border-red-400' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent`}
                      placeholder="John Doe"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input w-full p-4 bg-slate-700/50 border ${formErrors.email ? 'border-red-400' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent`}
                      placeholder="john@example.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-white font-medium mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="form-input w-full p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      placeholder="Your Company"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-white font-medium mb-2">
                      Service Interested In
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="form-input w-full p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    >
                      <option value="">Select a service</option>
                      <option value="graphic-design">Graphic Design</option>
                      <option value="web-development">Web Development</option>
                      <option value="ui-ux-design">UI/UX Design</option>
                      <option value="security-consulting">Security Consulting</option>
                      <option value="custom-project">Custom Project</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-white font-medium mb-2">
                    Project Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className={`form-input w-full p-4 bg-slate-700/50 border ${formErrors.message ? 'border-red-400' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-vertical`}
                    placeholder="Tell me about your project, goals, timeline, and any specific requirements..."
                  />
                  {formErrors.message && (
                    <p className="mt-1 text-sm text-red-400">{formErrors.message}</p>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 group transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message via WhatsApp
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-slate-400">
                    Prefer email? Send me a message at{" "}
                    <a
                      href="mailto:nexus.dynasty.org@gmail.com"
                      className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors duration-300"
                    >
                      nexus.dynasty.org@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <p className="text-sm text-slate-400 text-center">
                  🔒 By submitting this form, you agree to our privacy policy. Your information will be used solely for project communication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;