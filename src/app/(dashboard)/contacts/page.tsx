"use client";

import { AddRounded, PersonRounded, SearchRounded } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Collapse,
  TextField,
  type Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { mockContacts } from "@/features/contacts/constants/mockData";
import type { Contact } from "@/features/contacts/types";

const AVATAR_COLORS = [
  "#6A4BBC",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#8B5CF6",
  "#14B8A6",
  "#F97316",
  "#6366F1",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  return color ?? "#6A4BBC";
}

function formatDate(iso: string): string {
  try {
    return format(new Date(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
}

export default function ContactsPage() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return mockContacts;
    const q = search.toLowerCase();
    return mockContacts.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.organization?.toLowerCase().includes(q),
    );
  }, [search]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            Contacts
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {filtered.length} contact{filtered.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddRounded />}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Add Contact
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search contacts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <SearchRounded
                sx={{ color: "text.secondary", mr: 1, fontSize: 20 }}
              />
            ),
          },
        }}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            bgcolor: alpha(theme.palette.action.active, 0.03),
            "& fieldset": {
              borderColor: "divider",
            },
          },
        }}
      />

      {/* Empty state */}
      {filtered.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <PersonRounded
            sx={{
              fontSize: 48,
              color: "text.secondary",
              opacity: 0.4,
              mb: 1,
            }}
          />
          <Typography variant="h6" color="text.secondary">
            No contacts found
          </Typography>
        </Box>
      )}

      {/* Contact grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 2,
        }}
      >
        {filtered.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            expanded={expandedId === contact.id}
            onToggle={() => toggleExpand(contact.id)}
            theme={theme}
          />
        ))}
      </Box>
    </Box>
  );
}

function ContactCard({
  contact,
  expanded,
  onToggle,
  theme,
}: {
  contact: Contact;
  expanded: boolean;
  onToggle: () => void;
  theme: Theme;
}) {
  const initials = `${contact.firstName[0]}${contact.lastName[0]}`;
  const avatarColor = getAvatarColor(`${contact.firstName}${contact.lastName}`);
  const fullName = `${contact.firstName} ${contact.lastName}`;

  return (
    <Box
      onClick={onToggle}
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: "background.paper",
        cursor: "pointer",
        transition: "all 150ms ease",
        overflow: "hidden",
        "&:hover": {
          borderColor: alpha(theme.palette.primary.main, 0.3),
          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.08)}`,
        },
      }}
    >
      {/* Card header — always visible */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
        {/* Avatar */}
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(avatarColor, 0.12),
            color: avatarColor,
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.02em",
            flexShrink: 0,
          }}
        >
          {initials}
        </Box>

        {/* Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
            {fullName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block" }}
            noWrap
          >
            {contact.email}
          </Typography>
          {contact.organization && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 0.25,
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                opacity: 0.7,
              }}
              noWrap
            >
              {contact.organization}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Expanded details */}
      <Collapse in={expanded} timeout={200}>
        <Box
          sx={{
            px: 2.5,
            pb: 2.5,
            pt: 0,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 1.5 }}
          >
            {contact.phone && <DetailRow label="Phone" value={contact.phone} />}
            {contact.notes && <DetailRow label="Notes" value={contact.notes} />}
            <DetailRow label="Created" value={formatDate(contact.createdAt)} />
            <DetailRow label="Updated" value={formatDate(contact.updatedAt)} />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.65rem",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "text.secondary",
          opacity: 0.7,
        }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.25, lineHeight: 1.5 }}>
        {value}
      </Typography>
    </Box>
  );
}
