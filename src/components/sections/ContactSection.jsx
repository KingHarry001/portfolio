import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, MapPin, Send, Calendar, ExternalLink,
  Github, Twitter, Instagram, Linkedin, Clock, Globe,
  CheckCircle, AlertCircle, MessageSquare, ArrowRight,
  Loader2
} from "lucide-react";

// --- Configuration ---
const personalInfo = {
  email: "nexus.dynasty.org@gmail.com",
  phone: "+234 903 816 3213",
  location: "Lagos, Nigeria",
  whatsappNumber: "2349038163213"
};

const socialLinks = [
  { name: "GitHub", url: "https://github.com/", icon: <Github size={20} />, color: "text-zinc-400 hover:text-white" },
  { name: "LinkedIn", url: "https://linkedin.com/", icon: <Linkedin size={20} />, color: "text-blue-400 hover:text-blue-300" },
  { name: "Instagram", url: "https://instagram.com/", icon: <Instagram size={20} />, color: "text-pink-400 hover:text-pink-300" },
  { name: "Twitter", url: "https://twitter.com/", icon: <Twitter size={20} />, color: "text-cyan-400 hover:text-cyan-300" },
];

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [formStatus, setFormStatus] = useState("idle"); // idle, submitting, success, error
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formStatus === "error") setFormStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus("error");
      return;
    }

    setFormStatus("submitting");

    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));

    // Construct WhatsApp URL
    const message = `🚀 New Inquiry\n\n👤 Name: ${formData.name}\n📧 Email: ${formData.email}\n🏢 Company: ${formData.company || "N/A"}\n🛠 Service: ${formData.service || "General"}\n\n💬 Message:\n${formData.message}`;
    const whatsappURL = `https://wa.me/${personalInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappURL, "_blank");
    setFormStatus("success");
    setFormData({ name: "", email: "", company: "", service: "", message: "" });
    
    setTimeout(() => setFormStatus("idle"), 5000);
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="contact" className="relative py-24 bg-[#050505] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 text-sm font-semibold mb-6">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-7xl font-black text-white mb-6">
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Collaborate.</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Ready to build something extraordinary? Whether it's a complex web app or a security audit, I'm here to help.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left Column: Contact Info */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {/* Info Cards */}
            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: personalInfo.email, sub: "Response within 24h" },
                { icon: Phone, label: "Phone", value: personalInfo.phone, sub: "Mon-Fri, 9am-6pm" },
                { icon: MapPin, label: "Location", value: personalInfo.location, sub: "Available for Remote Work" },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="flex items-center gap-6 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-cyan-500/30 transition-all group"
                >
                  <div className="p-4 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{item.label}</h4>
                    <p className="text-zinc-300 font-medium">{item.value}</p>
                    <p className="text-zinc-500 text-sm mt-1">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Proof / Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                <Globe size={18} className="text-cyan-500" /> Connect on Socials
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-4 rounded-xl bg-zinc-900 border border-white/10 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10 ${social.color}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-2xl opacity-10" />
            <form 
              onSubmit={handleSubmit}
              className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="text-cyan-400" />
                <h3 className="text-2xl font-bold text-white">Send a Message</h3>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FloatingInput 
                    label="Name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    focused={focusedField === "name"}
                    setFocused={setFocusedField}
                  />
                  <FloatingInput 
                    label="Email" 
                    name="email" 
                    type="email"
                    value={formData.email} 
                    onChange={handleInputChange} 
                    focused={focusedField === "email"}
                    setFocused={setFocusedField}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FloatingInput 
                    label="Company (Optional)" 
                    name="company" 
                    value={formData.company} 
                    onChange={handleInputChange} 
                    focused={focusedField === "company"}
                    setFocused={setFocusedField}
                  />
                  <div className="relative">
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white appearance-none focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="" disabled>Select Interest</option>
                      <option value="dev">Web Development</option>
                      <option value="security">Security Audit</option>
                      <option value="design">UI/UX Design</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">▼</div>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    rows={5}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <AnimatePresence mode="wait">
                  {formStatus === "error" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg"
                    >
                      <AlertCircle size={16} /> Please fill in all required fields.
                    </motion.div>
                  )}
                  {formStatus === "success" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 p-3 rounded-lg"
                    >
                      <CheckCircle size={16} /> Redirecting to WhatsApp...
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  disabled={formStatus === "submitting"}
                  className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-cyan-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === "submitting" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>Send via WhatsApp <Send size={18} /></>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Helper Component for Floating Labels
const FloatingInput = ({ label, name, value, onChange, type = "text", focused, setFocused }) => (
  <div className="relative">
    <motion.label
      initial={false}
      animate={{
        y: focused || value ? -24 : 0,
        x: focused || value ? 0 : 16,
        scale: focused || value ? 0.85 : 1,
        color: focused ? "#22d3ee" : "#71717a"
      }}
      className="absolute top-4 left-0 pointer-events-none origin-left transition-colors"
    >
      {label}
    </motion.label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(name)}
      onBlur={() => setFocused(null)}
      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
    />
  </div>
);

export default ContactSection;