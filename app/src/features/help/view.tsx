import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, HelpCircle, ShieldCheck } from "lucide-react";
import React, { useState } from "react";

// Define types for help sections
type HelpItem = {
  q: string;
  a: string;
};

type HelpSection = {
  title: string;
  items: HelpItem[];
};

// Define types for legal documents
type LegalDocument = {
  name: string;
  icon: React.ElementType;
  content: string;
};

export function HelpView() {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const helpSections: HelpSection[] = [
    {
      title: "Getting Started",
      items: [
        {
          q: "How do I download music from YouTube and SoundCloud?",
          a: "Simply paste the URL of the track. Our app handles the conversion and saves it directly to your account. Currently, supported platforms include YouTube and SoundCloud.",
        },
        {
          q: "Can I download entire playlists?",
          a: "Not yet! We're working on adding this feature in the future, so stay tuned.",
        },
        {
          q: "How many tracks can I download?",
          a: "There's no strict limit, but we recommend maintaining a reasonably sized library to get the most out of Muse.",
        },
      ],
    },
    {
      title: "Account Management",
      items: [
        {
          q: "How do I manage my downloaded tracks?",
          a: "In your library, you can organize, delete, and create custom playlists from your downloaded tracks.",
        },
        {
          q: "Is my account secure?",
          a: "Yes. Passwords are hashed and stored securely, and we use encryption to protect your personal data.",
        },
        {
          q: "How do I change my account details?",
          a: "You can update your username, email, password, and profile picture in the account settings.",
        },
        {
          q: "How do I delete my account?",
          a: "Within the settings page, you can delete your account and all associated data permanently.",
        },
      ],
    },
  ];

  const legalDocuments: LegalDocument[] = [
    {
      name: "Terms of Service",
      icon: FileText,
      content:
        "Our Terms of Service outline the rules and regulations for using the Muse platform.",
    },
    {
      name: "Privacy Policy",
      icon: ShieldCheck,
      content:
        "The Privacy Policy explains how we collect, use, and protect your personal data.",
    },
  ];

  const openDialog = (dialogName: string) => {
    setActiveDialog(dialogName);
  };

  return (
    <Card className="h-full mx-auto bg-black/10 backdrop-blur-md border-none shadow-sm shadow-purple-500/50 border-t-2 border-t-purple-500">
      <CardHeader>
        <CardTitle className="flex items-center">
          <HelpCircle className="mr-3" /> Help & Support
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Help Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {helpSections.map((section, sectionIndex) => (
              <AccordionItem
                key={sectionIndex}
                value={`section-${sectionIndex}`}
                className="border-b border-purple-500/20"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent>
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="mb-4 pl-4">
                      <h3 className="font-medium text-base mb-1">{item.q}</h3>
                      <p className="text-sm text-muted-foreground">{item.a}</p>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Legal Documents */}
          <div className="grid md:grid-cols-2 gap-4">
            {legalDocuments.map((doc) => (
              <Dialog
                key={doc.name}
                open={activeDialog === doc.name}
                onOpenChange={(open) => setActiveDialog(open ? doc.name : null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-black/10 hover:bg-black/20"
                    onClick={() => openDialog(doc.name)}
                  >
                    <doc.icon className="mr-2" />
                    {doc.name}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-black/20 backdrop-blur-lg">
                  <DialogHeader>
                    <DialogTitle>{doc.name}</DialogTitle>
                  </DialogHeader>
                  <div className="prose max-w-none text-sm">
                    <p>{doc.content}</p>
                    {doc.name === "Terms of Service" && (
                      <>
                        <h2>1. Usage Rights</h2>
                        <p>
                          By using our platform, you agree to download and
                          stream music for personal use only.
                        </p>

                        <h2>2. Content Responsibility</h2>
                        <p>
                          Users are responsible for ensuring they have the right
                          to download and stream content.
                        </p>
                      </>
                    )}
                    {doc.name === "Privacy Policy" && (
                      <>
                        <h2>1. Data Collection</h2>
                        <p>
                          We collect minimal personal information required to
                          provide our service.
                        </p>

                        <h2>2. Data Protection</h2>
                        <p>
                          Your downloaded music and personal data are encrypted
                          and securely stored.
                        </p>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
          {/* TODO: Get an email domain */}
          {/* <div className="flex justify-end">
            <Button variant="outline" className="bg-black/10 hover:bg-black/20">
              <BookOpen className="mr-2" /> Contact Muse Support
            </Button>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
