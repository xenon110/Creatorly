import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Marquee } from '@/components/ui/3d-testimonails';

// Unique reviews data
export const testimonials = [
  {
    name: 'Ava Green',
    username: '@ava',
    body: 'Creatorly smart escrows made brand deals 10x faster and zero-stress!',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    country: '🇦🇺 Australia',
  },
  {
    name: 'Ana Miller',
    username: '@ana',
    body: 'Automated milestone payouts is a game changer for full-time creators.',
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    country: '🇩🇪 Germany',
  },
  {
    name: 'Mateo Rossi',
    username: '@mat',
    body: 'Verified creator analytics and engagement reports are buttery smooth!',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    country: '🇮🇹 Italy',
  },
  {
    name: 'Maya Patel',
    username: '@maya',
    body: 'Campaign studio squad builder took less than 2 minutes to finalize.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    country: '🇮🇳 India',
  },
  {
    name: 'Noah Smith',
    username: '@noah',
    body: 'Best sponsor marketplace we have worked with. Payouts arrive same-day.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    country: '🇺🇸 USA',
  },
  {
    name: 'Lucas Stone',
    username: '@luc',
    body: 'Zero ghosting, direct creator communications, clear deliverables.',
    img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    country: '🇫🇷 France',
  },
  {
    name: 'Haruto Sato',
    username: '@haru',
    body: 'Cross-platform verification gave our agency instant confidence.',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    country: '🇯🇵 Japan',
  },
  {
    name: 'Emma Lee',
    username: '@emma',
    body: 'Multi-creator contracts packaged in a single escrow invoice. Pure magic.',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    country: '🇨🇦 Canada',
  },
  {
    name: 'Carlos Ray',
    username: '@carl',
    body: 'Great for high-ROI campaign tracking and verified performance.',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    country: '🇪🇸 Spain',
  },
];

export function TestimonialCard({ img, name, username, body, country }: (typeof testimonials)[number]) {
  return (
    <Card className="w-56 min-w-[210px] bg-white border border-slate-200/90 shadow-sm rounded-xl hover:border-emerald-400 hover:shadow-md transition-all">
      <CardContent className="p-3.5">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9 border border-emerald-100">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback className="bg-emerald-50 text-emerald-700 font-semibold text-xs">{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left">
            <figcaption className="text-xs font-semibold text-slate-900 flex items-center gap-1">
              {name} <span className="text-[10px]">{country}</span>
            </figcaption>
            <p className="text-[11px] font-medium text-slate-500">{username}</p>
          </div>
        </div>
        <blockquote className="mt-2.5 text-xs leading-relaxed text-slate-700 font-normal text-left">{body}</blockquote>
      </CardContent>
    </Card>
  );
}

export default function DemoOne() {
  return (
    <div className="border border-slate-200 bg-white/70 backdrop-blur-sm rounded-2xl relative flex h-[380px] w-full max-w-[800px] flex-row items-center justify-center overflow-hidden gap-1.5 [perspective:300px] shadow-sm">
      <div
        className="flex flex-row items-center gap-3.5"
        style={{
          transform:
            'translateX(-60px) translateY(0px) translateZ(-80px) rotateX(18deg) rotateY(-8deg) rotateZ(16deg)',
        }}
      >
        {/* Vertical Marquee (downwards) */}
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:36s]">
          {testimonials.map((review) => (
            <TestimonialCard key={`col1-${review.username}`} {...review} />
          ))}
        </Marquee>
        {/* Vertical Marquee (upwards) */}
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={`col2-${review.username}`} {...review} />
          ))}
        </Marquee>
        {/* Vertical Marquee (downwards) */}
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:34s]">
          {testimonials.map((review) => (
            <TestimonialCard key={`col3-${review.username}`} {...review} />
          ))}
        </Marquee>
        {/* Vertical Marquee (upwards) */}
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:42s]">
          {testimonials.map((review) => (
            <TestimonialCard key={`col4-${review.username}`} {...review} />
          ))}
        </Marquee>

        {/* Gradient overlays for 3D fade depth */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white via-white/80 to-transparent"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white via-white/80 to-transparent"></div>
      </div>
    </div>
  );
}
