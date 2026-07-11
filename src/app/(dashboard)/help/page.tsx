"use client";

import {
  AdminPanelSettingsRounded,
  ContactMailRounded,
  ExpandMoreRounded,
  InfoRounded,
  MailRounded,
  SearchRounded,
  SecurityRounded,
  SettingsRounded,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Box,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";

const faqSections = [
  {
    category: "Getting Started",
    icon: <InfoRounded sx={{ fontSize: 20 }} />,
    color: "#3B82F6",
    items: [
      {
        question: "How do I access my email?",
        answer:
          "Click 'Continue with SSO' on the login page to authenticate via Keycloak. Once authenticated, you'll be redirected to your inbox automatically.",
      },
      {
        question: "What browsers are supported?",
        answer:
          "Omnixys Mail supports all modern browsers including Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. We recommend keeping your browser up to date for the best experience.",
      },
      {
        question: "How do I compose a new email?",
        answer:
          "Click the 'Compose' button in the mail toolbar or use the keyboard shortcut Ctrl+N. A compose drawer will open at the bottom of the screen where you can write your message.",
      },
    ],
  },
  {
    category: "Mail Features",
    icon: <MailRounded sx={{ fontSize: 20 }} />,
    color: "#6A4BBC",
    items: [
      {
        question: "How do I search for emails?",
        answer:
          "Use the search bar at the top of the message list. You can search by sender, subject, or content. Use advanced operators like 'from:', 'subject:', and 'has:attachment' for precise filtering.",
      },
      {
        question: "Can I organize emails into folders?",
        answer:
          "Yes! Use the mailbox tree on the left to navigate folders. You can create custom folders, move emails between them, and set up sieve filters for automatic organization.",
      },
      {
        question: "How do I set up email filters?",
        answer:
          "Navigate to Settings > Sieve Filters to create rules that automatically sort, forward, or categorize incoming mail based on sender, subject, or content patterns.",
      },
      {
        question: "Does Omnixys Mail support keyboard shortcuts?",
        answer:
          "Yes! Common shortcuts include: Ctrl+N (new message), R (reply), A (reply all), F (forward), E (archive), and Delete (move to trash). Press ? to see all shortcuts.",
      },
    ],
  },
  {
    category: "Security & Privacy",
    icon: <SecurityRounded sx={{ fontSize: 20 }} />,
    color: "#EF4444",
    items: [
      {
        question: "How is my email protected?",
        answer:
          "All connections use TLS 1.3 encryption. Emails are signed with DKIM and verified with SPF/DMARC. Your account is secured via Keycloak SSO with optional two-factor authentication.",
      },
      {
        question: "What is DKIM and how do I set it up?",
        answer:
          "DKIM (DomainKeys Identified Mail) cryptographically signs outgoing emails to verify they haven't been tampered with. Admins can manage DKIM keys in Admin > DKIM Settings.",
      },
      {
        question: "Can I enable two-factor authentication?",
        answer:
          "Yes! Go to Settings > Security and click 'Enable 2FA'. You can use authenticator apps (TOTP) or hardware security keys for an additional layer of protection.",
      },
    ],
  },
  {
    category: "Administration",
    icon: <AdminPanelSettingsRounded sx={{ fontSize: 20 }} />,
    color: "#F59E0B",
    items: [
      {
        question: "How do I add a new domain?",
        answer:
          "Go to Admin > Domains and click 'Add Domain'. Enter your domain name, configure MX records pointing to the Stalwart server, and set up SPF/DKIM/DMARC DNS records for optimal deliverability.",
      },
      {
        question: "How do I manage user accounts?",
        answer:
          "Navigate to Admin > Users to create, edit, or disable accounts. You can assign roles, set storage quotas, and manage permissions for each user.",
      },
      {
        question: "Where can I monitor mail queue and delivery?",
        answer:
          "Go to Admin > Queue to see the real-time mail queue with delivery status. Admin > Monitoring shows delivery throughput, latency metrics, and system health dashboards.",
      },
    ],
  },
  {
    category: "Settings & Configuration",
    icon: <SettingsRounded sx={{ fontSize: 20 }} />,
    color: "#22C55E",
    items: [
      {
        question: "How do I change my display name?",
        answer:
          "Go to Settings > Profile and click 'Edit Profile'. You can update your display name, avatar, and other personal information.",
      },
      {
        question: "Can I switch between light and dark mode?",
        answer:
          "Yes! Go to Settings > Appearance and toggle the dark mode switch. You can also set it to 'System' to automatically match your operating system preference.",
      },
      {
        question: "How do I change the language?",
        answer:
          "Navigate to Settings > Appearance and use the Language dropdown to switch between English (en) and Deutsch (de).",
      },
    ],
  },
  {
    category: "Contacts & Calendar",
    icon: <ContactMailRounded sx={{ fontSize: 20 }} />,
    color: "#EC4899",
    items: [
      {
        question: "How do I add contacts?",
        answer:
          "Go to Contacts and click 'Add Contact'. Fill in the contact details including name, email, phone, and organization. Contacts are synced with your JMAP account.",
      },
      {
        question: "Can I import contacts from another provider?",
        answer:
          "Yes! Use the import function in Contacts to upload a vCard (.vcf) or CSV file. We support imports from Gmail, Outlook, Apple Contacts, and standard formats.",
      },
      {
        question: "How does the calendar work?",
        answer:
          "The calendar provides a month view with event management. Click on any day to see or add events. Color-coding helps you distinguish between personal, work, and team events.",
      },
    ],
  },
];

export default function HelpPage() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = faqSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.02em" }}
      >
        Help & Documentation
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Find answers to common questions and learn how to use Omnixys Mail.
      </Typography>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search help topics..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 4 }}
      />

      {/* FAQ Sections */}
      {filteredSections.map((section) => (
        <Box key={section.category} sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                background: alpha(section.color, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: section.color,
              }}
            >
              {section.icon}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {section.category}
            </Typography>
            <Chip
              label={section.items.length}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.75rem",
                bgcolor: alpha(section.color, 0.1),
                color: section.color,
                fontWeight: 600,
              }}
            />
          </Box>

          {section.items.map((item) => (
            <Accordion
              key={item.question}
              disableGutters
              sx={{
                mb: 0.5,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px !important",
                "&::before": { display: "none" },
                boxShadow: "none",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ))}

      {filteredSections.length === 0 && (
        <Card sx={{ border: `1px solid ${theme.palette.divider}` }}>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <SearchRounded
              sx={{
                fontSize: 48,
                color: "text.secondary",
                opacity: 0.4,
                mb: 1,
              }}
            />
            <Typography variant="h6" color="text.secondary">
              No results found for "{searchQuery}"
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try different keywords or browse the sections below.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Contact Support */}
      <Card
        sx={{
          mt: 4,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
        }}
      >
        <CardContent sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Still need help?
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Contact the IT team at{" "}
            <Box
              component="span"
              sx={{ color: "primary.main", fontWeight: 500 }}
            >
              support@omnixys.com
            </Box>{" "}
            or reach out via the #help channel in chat.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
