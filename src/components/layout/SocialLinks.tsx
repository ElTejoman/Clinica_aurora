import { Icon, type IconName } from "@/components/ui/Icon";
import { SITE } from "@/config/site";
import { cn } from "@/utils/cn";

const NETWORKS: { key: keyof typeof SITE.social; label: string; icon: IconName }[] = [
  { key: "facebook", label: "Facebook", icon: "facebook" },
  { key: "instagram", label: "Instagram", icon: "instagram" },
  { key: "tiktok", label: "TikTok", icon: "tiktok" },
  { key: "youtube", label: "YouTube", icon: "youtube" },
];

/** Iconos de redes sociales de la clínica. */
export function SocialLinks({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <ul className={cn("m-0 flex list-none items-center gap-1 p-0", className)}>
      {NETWORKS.map((n) => (
        <li key={n.key}>
          <a
            href={SITE.social[n.key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${SITE.name} en ${n.label}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-current no-underline transition-colors hover:bg-white/15"
          >
            <Icon name={n.icon} size={size} strokeWidth={1.8} />
          </a>
        </li>
      ))}
    </ul>
  );
}
