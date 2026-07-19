import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";

export interface FreelancerCardData {
  id: string;
  name: string;
  avatarSeed: string;
  title: string | null;
  location: string | null;
  isVerified: boolean;
  skills: string | null;
  avgRating: number;
  reviewCount: number;
  servicesCount: number;
}

export function FreelancerCard({ freelancer }: { freelancer: FreelancerCardData }) {
  const skills = freelancer.skills?.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3) ?? [];

  return (
    <Link
      href={`/freelancers/${freelancer.id}`}
      className="flex flex-col items-center rounded-xl2 border border-ink-100 bg-cream-50 p-6 text-center shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <Avatar seed={freelancer.avatarSeed} name={freelancer.name} size="xl" verified={freelancer.isVerified} />
      <h3 className="mt-4 font-display text-lg font-medium text-ink-900">{freelancer.name}</h3>
      {freelancer.title && <p className="text-sm text-ink-500">{freelancer.title}</p>}
      {freelancer.location && <p className="mt-0.5 text-xs text-ink-300">{freelancer.location}</p>}

      {freelancer.reviewCount > 0 && (
        <div className="mt-3">
          <Rating value={freelancer.avgRating} count={freelancer.reviewCount} />
        </div>
      )}

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {skills.map((skill) => (
            <Badge key={skill} tone="neutral">
              {skill}
            </Badge>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-ink-300">{freelancer.servicesCount} услуг на платформе</p>
    </Link>
  );
}
