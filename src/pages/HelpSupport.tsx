import React, { useState } from "react";
import { 
  Search, 
  Phone, 
  Mail, 
  MessageCircle, 
  FileText, 
  Users, 
  Shield, 
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
  CheckCircle,
  Star,
  Home,
  Headphones
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import './HelpSupport.css';

interface FAQ {
  question: string;
  answer: string;
}

interface FormData {
  name: string;
  email: string;
  category: string;
  message: string;
}

const HelpSupport: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    category: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call - replace with your MongoDB API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Message Sent Successfully!",
      description: `Thank you ${formData.name}. We'll respond to ${formData.email} within 4 hours during business hours.`,
    });
    
    setFormData({ name: "", email: "", category: "", message: "" });
    setIsSubmitting(false);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs: FAQ[] = [
    {
      question: "How do I register for a new license on DigiSewa portal?",
      answer: "To register for a new license, click on 'Apply for License' from the main menu. You'll need to provide your personal details, business information, and upload required documents. The process typically takes 5-7 business days for initial review."
    },
    {
      question: "What documents are required for license registration?",
      answer: "Required documents include: Aadhaar Card, PAN Card, Address Proof, Business Registration Certificate, Passport-size photographs, and specific trade license documents depending on your business category."
    },
    {
      question: "How can I track my application status?",
      answer: "You can track your application status by logging into your DigiSewa account and visiting the 'Track Application' section. You'll also receive SMS and email updates at key milestones."
    },
    {
      question: "What are the fees for different types of licenses?",
      answer: "License fees vary by category: Trade License (₹500-2000), Food License (₹2000-5000), Manufacturing License (₹5000-15000). Additional processing fees may apply. Check the fee structure page for detailed information."
    },
    {
      question: "How long does it take to get license approval?",
      answer: "Standard processing time is 15-30 working days after document verification. Express processing (7-14 days) is available for additional fees. Complex applications may take up to 45 days."
    },
    {
      question: "Can I update my application after submission?",
      answer: "Limited updates are allowed within 48 hours of submission. After that, you'll need to contact support. Major changes may require resubmission with applicable fees."
    },
    {
      question: "How do I download my digital license certificate?",
      answer: "Once approved, log into your DigiSewa account, go to 'My Licenses' section, and click 'Download Certificate'. The digital certificate is legally valid and can be printed if needed."
    },
    {
      question: "What should I do if my application is rejected?",
      answer: "If rejected, you'll receive detailed reasons via email and SMS. You can reapply after addressing the issues mentioned, or contact our support team for clarification and assistance."
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const steps = [
    {
      number: 1,
      title: "Contact Support",
      description: "Use our helpline, email, or live chat for immediate assistance"
    },
    {
      number: 2,
      title: "Submit Documents",
      description: "Upload required documents through the secure portal"
    },
    {
      number: 3,
      title: "Track Progress",
      description: "Monitor your application status in real-time"
    },
    {
      number: 4,
      title: "Get Approved",
      description: "Receive your digital license via email and SMS"
    }
  ];

  const relatedLinks = [
    { title: "Home", url: "/", icon: Home },
    { title: "Feedback", url: "/feedback", icon: MessageCircle }
  ];

  return (
    <div className="gov-portal">
        {/* Header Section */}
        <div className="gov-header">
          <div className="header-content">
            <div className="government-emblem">
              <Star className="emblem-icon" />
              <div className="emblem-text">
                <span className="emblem-title">भारत सरकार</span>
                <span className="emblem-subtitle">Government of India</span>
              </div>
            </div>
            <div className="header-badge">
              <Shield className="badge-icon" />
              <span>Official Government Portal</span>
            </div>
            <h1 className="page-title">
              Help & Support – DigiSewa
              <div className="title-underline"></div>
            </h1>
            <p className="page-subtitle">
              Your one-stop destination for license registration assistance. We provide comprehensive support 
              for all government services including trade licenses, permits, and regulatory approvals.
            </p>
          </div>
        </div>

      <div className="content-container">
        {/* Contact Information Cards */}
        <div className="contact-grid">
          <div className="contact-card emergency">
            <div className="card-header">
              <Phone className="card-icon" />
              <span className="card-badge">24/7</span>
            </div>
            <h3>Emergency Helpline</h3>
            <p className="phone-number">1800-123-4567</p>
            <p className="card-description">Toll-free | Available 24/7</p>
          </div>

          <div className="contact-card email">
            <div className="card-header">
              <Mail className="card-icon" />
              <span className="card-badge">4hrs</span>
            </div>
            <h3>Email Support</h3>
            <p className="email-address">support@digisewa.gov.in</p>
            <p className="card-description">Response within 4 hours</p>
          </div>

          <div className="contact-card chat">
            <div className="card-header">
              <Headphones className="card-icon" />
              <span className="card-badge">Live</span>
            </div>
            <h3>Customer Care</h3>
            <p className="phone-number">180-0-CARE-123</p>
            <p className="card-description">Mon-Fri: 9 AM - 6 PM</p>
          </div>

          <div className="contact-card office">
            <div className="card-header">
              <MapPin className="card-icon" />
              <span className="card-badge">Office</span>
            </div>
            <h3>Visit Office</h3>
            <p className="office-address">DigiSewa Bhawan<br />Sector 1, New Delhi - 110001</p>
            <p className="card-description">Mon-Fri: 10 AM - 5 PM</p>
          </div>
        </div>

        {/* Search FAQ Section */}
        <div className="search-section">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <div className="section-header">
            <FileText className="section-icon" />
            <h2>Frequently Asked Questions</h2>
            <span className="faq-count">{filteredFAQs.length} questions</span>
          </div>
          
          <div className="faq-accordion">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className={`faq-item ${openFAQ === index ? 'active' : ''}`}>
                <button 
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openFAQ === index}
                >
                  <span>{faq.question}</span>
                  {openFAQ === index ? <ChevronUp /> : <ChevronDown />}
                </button>
                {openFAQ === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                    <div className="faq-footer">
                      <span className="helpful-text">Was this helpful?</span>
                      <div className="helpful-buttons">
                        <button className="helpful-btn yes">👍 Yes</button>
                        <button className="helpful-btn no">👎 No</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div className="steps-section">
          <div className="section-header">
            <CheckCircle className="section-icon" />
            <h2>How to Get Help</h2>
            <p>Follow these simple steps to get assistance with your license registration</p>
          </div>
          
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-item">
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {index < steps.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="contact-section">
          <div className="section-header">
            <Users className="section-icon" />
            <h2>Contact Our Support Team</h2>
            <p>Can't find what you're looking for? Send us a message and we'll help you directly.</p>
          </div>
          
          <div className="contact-container">
            <div className="contact-info">
              <div className="info-item">
                <Clock className="info-icon" />
                <div>
                  <h4>Response Time</h4>
                  <p>We typically respond within 4 hours during business hours</p>
                </div>
              </div>
              <div className="info-item">
                <Shield className="info-icon" />
                <div>
                  <h4>Data Security</h4>
                  <p>Your information is protected with government-grade encryption</p>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category">Issue Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select an issue category</option>
                  <option value="registration">License Registration</option>
                  <option value="documents">Document Issues</option>
                  <option value="payment">Payment & Fees</option>
                  <option value="status">Application Status</option>
                  <option value="renewal">License Renewal</option>
                  <option value="technical">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Describe your issue or question in detail..."
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                <MessageCircle className="btn-icon" />
                {isSubmitting ? "Sending Message..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        {/* Related Links */}
        <div className="related-links-section">
          <div className="section-header">
            <ExternalLink className="section-icon" />
            <h2>Quick Links</h2>
            <p>Access important pages and services related to license registration</p>
          </div>
          
          <div className="links-grid">
            {relatedLinks.map((link, index) => (
              <Link key={index} to={link.url} className="link-card">
                <link.icon className="link-icon" />
                <span>{link.title}</span>
                <ExternalLink className="external-icon" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
