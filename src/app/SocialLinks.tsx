import React from "react";
import { Globe, Twitter, MessageCircle, Network } from "lucide-react";

interface SocialLinksProps {
  telegram?: string;
  twitter?: string;
  website?: string;
  farcaster?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  telegram,
  twitter,
  website,
  farcaster,
}) => {
  const socials = [
    {
      name: "Telegram",
      url: telegram,
      icon: <MessageCircle className="w-5 h-5" />,
      color: "hover:bg-blue-500",
    },
    {
      name: "Twitter",
      url: twitter,
      icon: <Twitter className="w-5 h-5" />,
      color: "hover:bg-sky-500",
    },
    {
      name: "Website",
      url: website,
      icon: <Globe className="w-5 h-5" />,
      color: "hover:bg-gray-600",
    },
    {
      name: "Farcaster",
      url: farcaster,
      icon: <Network className="w-5 h-5" />,
      color: "hover:bg-purple-500",
    },
  ];

  return (
    <div className="flex items-center space-x-3">
      {socials
        .filter((s) => s.url)
        .map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            title={s.name}
            className={`p-2 bg-gray-100 rounded-full text-gray-700 transition-colors ${s.color}`}
          >
            {s.icon}
          </a>
        ))}
    </div>
  );
};

export default SocialLinks;
