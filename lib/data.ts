import type { NavItem, Stat, Listing, Testimonial, Agent, AboutContent, SocialLink, HeroContent, EventItem, EventSession } from '@/types'

// =============================================================================
// NAVIGATION
// =============================================================================

export const NAV_ITEMS: NavItem[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Buying', href: '/buying' },
  {
    label: 'Selling',
    children: [
      { label: 'Our Process', href: '/our-process' },
      { label: 'Property Preparation', href: '/property-prep' },
      { label: 'Staging Services', href: '/staging-services' },
    ],
  },
  { label: 'Properties', href: '/inventory' },
  { label: 'Halcyon Development', href: '/halcyon-development' },
  { label: 'Testimonials', href: '/testimonials' },
  {
    label: 'Client Resources',
    children: [
      { label: 'Our Trusted Vendors', href: '/vendors' },
      { label: 'Local School Guidance', href: '/schools' },
    ],
  },
  { label: 'Events', href: '/events' },
  { label: 'Press', href: '/press' },
]

// =============================================================================
// HERO
// =============================================================================

export const HERO: HeroContent = {
  headline: 'Chicago Real Estate, Personally Delivered',
  subheadline: 'Samantha Porter & Lauren Goldberg — boutique expertise for buying, selling, and building in Chicago.',
}

// =============================================================================
// STATS
// =============================================================================

export const STATS: Stat[] = [
  {
    value: 25,
    display: '25+',
    label: 'Combined Years',
    description: 'Combined expertise and experience in residential brokerage services',
  },
  {
    value: 95,
    display: '95%',
    label: 'Referral',
    description: 'Client base that confidently recommends our personal service and advocacy',
  },
  {
    value: 500,
    display: '$500M+',
    label: 'Career Sales',
    description: 'Career sales of existing homes, new construction, and land acquisitions',
  },
]

// =============================================================================
// ABOUT
// =============================================================================

export const ABOUT: AboutContent = {
  sectionLabel: 'Who We Are',
  headline: 'Buying, Selling, Owning Starts Here',
  intro: [
    "Real estate is personal — and so is our approach. We don't simply advise; we collaborate, advocate, and help shape the lifestyle you're building. The process — buying, selling, or creating something new — should feel seamless and smart.",
    'With complementary perspectives and a deep understanding of Chicago real estate, Samantha Porter and Lauren Goldberg anticipate challenges, identify opportunities, and connect you to the resources that matter.',
  ],
  tagline: "Anchored in the trusted integrity of Jameson Sotheby's International Realty — peerless client service, technology-forward resources, and a powerful global referral network.",
}

// =============================================================================
// LISTINGS
// =============================================================================

// export const LISTINGS: Listing[] = [
//   {
//     _id: '1',
//     address: '2129 N. Damen',
//     neighborhood: 'Bucktown',
//     price: '$965,000',
//     status: '50% Sold',
//     statusType: 'active',
//     image: { asset: { _id: 'static-1', url: '/exterior-mohawk_crop-2048x2034.png' } },
//     fallbackColor: '#2C3E35',
//     brochureUrl: 'https://presentation.jamesonps.com/2129-n-damen-property-brochure',
//   },
//   {
//     _id: '2',
//     address: '2481 N. Milwaukee',
//     neighborhood: 'Logan Square',
//     price: 'Inquire',
//     status: "Delivering Spring '26",
//     statusType: 'coming',
//     image: { asset: { _id: 'static-2', url: '/home_2481-N-MILWAUKEE-2.png' } },
//     fallbackColor: '#3A3228',
//     brochureUrl: 'https://presentation.jamesonps.com/2481-n-milwaukee-property-brochure',
//   },
//   {
//     _id: '3',
//     address: '327 W. Armitage',
//     neighborhood: 'Lincoln Park',
//     price: 'Inquire',
//     status: 'Sold',
//     statusType: 'sold',
//     image: { asset: { _id: 'static-3', url: '/327-W-Armitage-e1768086391919.png' } },
//     fallbackColor: '#28303C',
//     brochureUrl: 'https://presentation.jamesonps.com/327-w-armitage-1-property-brochrue',
//   },
//   {
//     _id: '4',
//     address: '2485 N. Milwaukee',
//     neighborhood: 'Logan Square',
//     price: '$975,000',
//     status: 'Sold',
//     statusType: 'sold',
//     image: { asset: { _id: 'static-4', url: '/2485-N-Milwaukee.png' } },
//     fallbackColor: '#362E2E',
//   },
// ]

// =============================================================================
// TESTIMONIALS
// =============================================================================

export const TESTIMONIALS: Testimonial[] = [
  {
    _id: '1',
    clientName: 'Jon Merel',
    clientTitle: 'Merel Family Law',
    quote: 'From start to close, working with Porter Goldberg was the most seamless, easy, stress-free home selling process I have ever encountered.',
  },
  {
    _id: '2',
    clientName: 'Lauren & Jamie Rauch',
    quote: 'Lauren and Samantha went above and beyond in facilitating the recent sale of our old home and purchase of a new home.',
  },
  {
    _id: '3',
    clientName: 'Hilary Goldfine',
    quote: 'Working with Lauren Goldberg and Samantha Porter was a game-changer. They went above and beyond to ensure I not only found the right property but also closed the deal smoothly.',
  },
  {
    _id: '4',
    clientName: 'Chris DeLeeuw',
    clientTitle: 'Partner/CEO of Halcyon Development',
    quote: "Samantha and Lauren's ability to draw on their years of experience, understand location dynamics and consumer demands has made them an invaluable part of our development team.",
  },
  {
    _id: '5',
    clientName: 'Gabriel Levin',
    clientTitle: 'Chicago, IL',
    quote: "NOBODY lists a property like Lauren Goldberg – her eye for detail, work ethic, and vast array of local contacts deliver margins that consistently outperform her competitors.",
  },
]

// =============================================================================
// AGENTS
// =============================================================================

export const AGENTS: Agent[] = [
  {
    _id: '1',
    name: 'Samantha Porter',
    initials: 'SP',
    phone: '773.988.7898',
    email: 'samantha@portergoldberg.com',
    fallbackColor: '#2C3E35',
    bio: {
      summary: "Seasoned, relationship-based broker with Jameson Sotheby's International Realty since 1999.",
      background: "Grew up on Chicago's South Side, attending University of Nebraska–Lincoln and University of Eastern Illinois with a Business Marketing degree.",
      expertise: 'Extensive experience in market navigation and positioning. Specializes in marketing, space planning, design, and property transformations.',
      personal: 'Married to David, a trained carpenter and owner of Homescape Construction. Two children in Logan Square, active in schools and community.',
      startYear: 1999,
    },
  },
  {
    _id: '2',
    name: 'Lauren Goldberg',
    initials: 'LG',
    phone: '773.576.0053',
    email: 'lauren@portergoldberg.com',
    fallbackColor: '#28303C',
    bio: {
      summary: "Broker at Jameson Sotheby's International Realty with a BA from DePaul University in Design and Fine Arts.",
      background: 'Spent five years as a Regional Manager in appliance and home materials distribution across four Midwest states, developing expertise in kitchen/bath design and materials.',
      expertise: 'Chicago Top Producer consistently since 2011. Specializes in luxury new construction and investment rehabs.',
      credentials: ['NAR member (National Association of Realtors)', 'CAR member (Chicago Association of Realtors)'],
      personal: 'Married to Brian (LG Group) since 2006. Resides in Lincoln Park with two children and two dogs.',
      startYear: 2008,
    },
  },
]

// =============================================================================
// SOCIAL
// =============================================================================

export const SOCIAL: SocialLink[] = [
  { platform: 'Facebook', url: 'https://www.facebook.com/portergoldbergresidential/' },
  { platform: 'Instagram', url: 'https://www.instagram.com/portergoldbergchicago/' },
]

// =============================================================================
// EVENTS (fallback data for development)
// =============================================================================

export const EVENTS: EventItem[] = [
  {
    _id: 'evt-1',
    title: 'Spring 2026 Chicago Market Update',
    date: '2026-05-15T16:00:00Z',
    description: 'Join Samantha and Lauren for an in-depth look at the Chicago housing market heading into summer. We\'ll cover pricing trends, inventory levels, and neighborhood-by-neighborhood analysis to help you make informed decisions.',
    registrationUrl: 'https://zoom.us/webinar/register/example',
    speakerName: 'Samantha Porter & Lauren Goldberg',
    speakerTitle: 'Broker Associates, Jameson Sotheby\'s International Realty',
    location: 'Online / Zoom',
    tags: ['Webinar', 'Market Update'],
    schedule: [
      {
        _key: 'sess-1a',
        startTime: '11:00 AM',
        endTime: '11:55 AM',
        speakerName: 'Samantha Porter',
        speakerOrganization: 'Jameson Sotheby\'s International Realty',
        topics: [
          'Chicago market pricing trends',
          'Neighborhood-level inventory analysis',
          'Interest rate outlook and buyer impact',
        ],
      },
      {
        _key: 'sess-1b',
        startTime: '12:00 PM',
        endTime: '1:00 PM',
        speakerName: 'Lauren Goldberg',
        speakerOrganization: 'Jameson Sotheby\'s International Realty',
        topics: [
          'Luxury segment performance',
          'New construction pipeline',
          'Investment opportunities for summer 2026',
        ],
      },
    ],
  },
  {
    _id: 'evt-2',
    title: 'First-Time Homebuyer Workshop',
    date: '2026-06-10T17:30:00Z',
    description: 'A free workshop covering everything first-time buyers need to know — from pre-approval and budgeting to inspections and closing. Bring your questions!',
    registrationUrl: 'https://zoom.us/webinar/register/example2',
    speakerName: 'Lauren Goldberg',
    speakerTitle: 'Broker Associate',
    location: 'Online / Zoom',
    tags: ['Workshop', 'Buying'],
  },
  {
    _id: 'evt-3',
    title: 'Winter 2026 Market Outlook',
    date: '2026-01-20T18:00:00Z',
    description: 'Our recap of the winter market with predictions for the spring selling season. We discussed interest rate impacts, luxury segment trends, and the best neighborhoods for investment.',
    speakerName: 'Samantha Porter & Lauren Goldberg',
    speakerTitle: 'Broker Associates',
    location: 'Online / Zoom',
    tags: ['Webinar', 'Market Update'],
  },
  {
    _id: 'evt-4',
    title: 'Preparing Your Home to Sell',
    date: '2025-11-05T18:00:00Z',
    description: 'Samantha walked through the key steps to maximize your home\'s value before listing — from staging and photography to pricing strategy and timeline planning.',
    speakerName: 'Samantha Porter',
    speakerTitle: 'Broker Associate',
    location: 'Online / Zoom',
    tags: ['Webinar', 'Selling'],
  },
]
