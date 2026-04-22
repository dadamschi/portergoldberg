import type { NavItem, Stat, AboutContent, HeroContent } from '@/types'

// =============================================================================
// NAVIGATION
// =============================================================================

export const NAV_ITEMS: NavItem[] = [
  { label: 'Buying', href: '/buying' },
  { label: 'Sell', href: '/selling' },
  { label: 'Properties', href: '/inventory' },
  { label: 'Halcyon Development', href: '/halcyon-development' },
  {
    label: 'About',
    children: [
      { label: 'Our Team', href: '/about' },
      { label: 'Testimonials', href: '/testimonials' },
      { label: 'Press', href: '/press' },
    ],
  },
  {
    label: 'Resources',
    children: [
      { label: 'Client Resources', href: '/client-resources' },
      { label: 'Events', href: '/events' },
      { label: 'Newsletter', href: '/newsletters' },
    ],
  },
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
// VENDORS
// =============================================================================

export type Vendor = {
  category: string
  firstName?: string
  lastName?: string
  company?: string
  address?: string
  city?: string
  phone?: string
  altPhone?: string
  email?: string
  website?: string
}

export const VENDORS: Vendor[] = [
  { category: 'Accountant', firstName: 'Jimmy', lastName: 'Passarelli Jr', company: 'Chicago Financial Accounting', address: '2715 N. Thatcher', city: 'River Grove', phone: '708-716-3677', email: 'jimmy@passacct.com' },
  { category: 'Appraiser', firstName: 'Richard', lastName: 'Kemph', company: 'Arrow Appraisal Group', city: 'Chicago', phone: '630-939-3424', email: 'info@arrowappraisalgroup.com' },
  { category: 'Appraiser', firstName: 'Bernie', lastName: 'Pedersoli', company: 'Citywide Appraisals', city: 'Chicago', phone: '773-517-3672', email: 'bernie@city-wide-appraisal.com' },
  { category: 'Art Installer', firstName: 'Natasha & Dan', company: 'Art Installer', city: 'Chicago', phone: '312-420-6752' },
  { category: 'Attorney, Family Law', firstName: 'Jon', lastName: 'Merel', company: 'Merel Family Law', city: 'Chicago', phone: '(312) 288-3057', email: 'jmerel@merelfamilylaw.com', website: 'https://www.merelfamilylaw.com' },
  { category: 'Attorney, Real Estate', firstName: 'Matthew', lastName: 'Howeth', company: 'Wifler Law Group', address: '103 W. Gilmer', city: 'Chicago', phone: '847-566-6882', email: 'matthew@wiflerlawgroup.com' },
  { category: 'Attorney, Real Estate', firstName: 'Kent', lastName: 'Novit', company: 'Novit Law', address: '100 N Lasalle 1700', city: 'Chicago', email: 'kent@novitlaw.com', website: 'https://www.novitlaw.com' },
  { category: 'Attorney, Real Estate', firstName: 'Stephanie', lastName: 'Orzoff', company: 'Levit & Lipshutz', city: 'Chicago', phone: '773-975-0030', email: 'sorzoff@levitlipshutz.com' },
  { category: 'Attorney, Real Estate', firstName: 'Bob', lastName: 'Connealy', company: 'Musillami & Conealy', address: '1 S. Dearborn', city: 'Chicago', phone: '312-445-0544', email: 'rdc@mandclegal.com', website: 'https://www.mandclegal.com' },
  { category: 'AV', firstName: 'David R', lastName: 'Schroeder', company: 'DRS Technologies/Alarm', address: '46 Danada Square W.', city: 'Wheaton', phone: '630-660-5676', email: 'drstechnologies@sbcglobal.net', website: 'https://www.drsalarm.com' },
  { category: 'AV', firstName: 'Brian', lastName: 'Miller', company: 'Connecteriors LLC', address: '3100 N Clybourn Ave', city: 'Chicago', phone: '773-549-3333', email: 'brian.miller@connecteriors.com', website: 'https://www.connecteriors.com' },
  { category: 'AV', firstName: 'Corey', lastName: 'Ardell', company: 'SCI Technologies', address: '2002 W. Huron St.', city: 'Chicago', phone: '312-243-1977', email: 'corey@sciav.com', website: 'https://www.scitechologies.com' },
  { category: 'AV', firstName: 'Georgi', lastName: 'Ganchovski', company: 'Low Voltage Networks Inc.', address: '1366 S 2nd Ave.', city: 'Des Plaines', phone: '847-902-3760', email: 'lowvolts@gmail.com' },
  { category: 'Baby Proofing', company: 'A&H Child Proofers', city: 'Chicago', phone: '847-650-2519', website: 'https://www.ahchildproofers.com' },
  { category: 'Basement Waterproofing', firstName: 'Dion', lastName: 'Gemein', company: 'Basement Water Proofing', city: 'Chicago', phone: '866-837-9227', altPhone: '630-802-3545', email: 'dgemein@comcast.net' },
  { category: 'Cabinet', firstName: 'Dave', lastName: 'Rodriguez', company: 'Marfa', city: 'Chicago', phone: '(312) 829-4300', email: 'david@buildmykitchen.com' },
  { category: 'Cabinet (Custom)', firstName: 'Matt', lastName: 'Pryby', city: 'Chicago', phone: '847-249-0007', email: 'mattpryby@att.net' },
  { category: 'Cabinet (Repair)', firstName: 'Jerry', company: 'CMG', city: 'Chicago', phone: '773-877-9069' },
  { category: 'Car Dealer', firstName: 'Josh', lastName: 'Resnick', company: 'Resnick Auto Group', city: 'Chicago', phone: '847-882-0200', email: 'resnick224@gmail.com', website: 'https://www.resnickautogroup.com' },
  { category: 'Carpet Cleaner', firstName: 'Mathew', lastName: 'Klujian', company: 'Mathew Klujian & Sons Inc.', address: '1421 W. Devon Avenue', city: 'Chicago', phone: '773-743-1300', email: 'sales@klujianrugs.com', website: 'https://www.klujianrugs.com' },
  { category: 'Chiropractor', firstName: 'Doug', lastName: 'Krefman', company: 'Chicago Spine and Sports', address: '922 W. Diversey Pkwy', city: 'Chicago', phone: '773-529-0057', website: 'https://chicagospineandsports.com' },
  { category: 'Cleaning Company', firstName: 'Karen', company: "Karen and Bella's Cleaning Company", city: 'Chicago', phone: '708-315-0346' },
  { category: 'Cleaning (Post Construction)', firstName: 'Tanya', lastName: 'Tikhonova', city: 'Chicago', phone: '773-726-7625' },
  { category: 'Closet', firstName: 'Lonny', lastName: 'Goldberg', company: 'Everything Closets', phone: '888-828-8280', altPhone: '312-593-1177', email: 'email@everythingclosets.com' },
  { category: 'Contractor', firstName: 'Dave', lastName: 'Porter', company: 'Homscape Construction', address: '1730 N Clark St', city: 'Chicago', phone: '773-934-0589', email: 'Daveporter66@gmail.com', website: 'https://www.homescapeconstruction.com' },
  { category: 'Contractor', firstName: 'Ryan', lastName: 'Buchmeier', company: 'LG Advantage', address: '363 W. Ontario St.', city: 'Chicago', phone: '773-227-2850', email: 'ryan@lg-group.com', website: 'https://www.lg-group.com' },
  { category: 'Contractor', firstName: 'Yaroslav', company: 'Great Midwest Construction', address: '1701 W. Catalpa Ln', city: 'Mount Prospect', phone: '708-715-0500', email: 'yaroslav@greatmidwestco.com' },
  { category: 'Contractor', firstName: 'Sosa', lastName: 'Evsin', company: 'AS Remodeling', phone: '312-498-7274', email: 'arsemodeling@icloud.com' },
  { category: 'Dog Trainer', firstName: 'Ducki' },
  { category: 'Dog Walker', firstName: 'Henderson', lastName: 'Robb', company: 'Green Paws Chicago', address: '2039 W. Belmont', city: 'Chicago', phone: '312-546-4185', website: 'https://www.greenpawschicago.com' },
  { category: 'Duct Cleaning', company: 'ER Duct Cleaner', address: '3008 North Nordica', city: 'Chicago', phone: '708-776-3070', email: 'info@erairductcleaning.com' },
  { category: 'Exterior Wall Sealing', firstName: 'Rufino', lastName: 'Salazar', company: 'Salazar Construction', address: '235 Siwiha Dr.', city: 'Grayslake', phone: '847-546-6889', website: 'https://www.salazarconstruction.com' },
  { category: 'Exterior Work', firstName: 'Michael', lastName: 'Walczak', company: 'Dad Exteriors', address: '2711 N. Pulaski', city: 'Chicago', website: 'https://www.dadexteriors.com' },
  { category: 'Exterminator', company: 'Orkin', address: '5840 N Lincoln Ave', city: 'Chicago', phone: '866-805-4863', website: 'https://www.orkin.com' },
  { category: 'Exterminator', company: 'Rose Pest Control', address: '1809 W. North Ave', city: 'Chicago', phone: '773-384-3000', website: 'https://www.rosepestcontrol.com' },
  { category: 'Florist', firstName: 'Traci', lastName: 'Potter', company: 'Mockingbird', city: 'Chicago', phone: '773-860-0970', email: 'tracijopotter@yahoo.com' },
  { category: 'Garage Build Outs', firstName: 'Tim', lastName: 'McManus', company: 'Garage Organization Plus', city: 'Chicago', altPhone: '773-230-1240', email: 'info@garageorganizationplus.com' },
  { category: 'Garage Door Repair', firstName: 'John', company: "Robert's Garage Doors", city: 'Chicago', phone: '312-933-1556' },
  { category: 'Graphic Designer', firstName: 'Ali', lastName: 'Gordon', city: 'Chicago', website: 'https://www.aligordondesigns.com' },
  { category: 'Handyman', firstName: 'Mark', lastName: 'Thyme', company: 'Handyman', city: 'Chicago', phone: '773-383-5849' },
  { category: 'Inspector', firstName: 'Leon', lastName: 'Mann', company: 'Home Advantage Inspections', address: '3570 Old Mill Rd', city: 'Highwood', phone: '312-401-0299', email: 'Leon@haipro.com', website: 'https://www.haipro.com' },
  { category: 'Inspector', firstName: 'Ross', lastName: 'Neag', company: 'Chicago Building Inspections, Inc', address: '456 N Oakley Blvd', city: 'Chicago', phone: '312-467-7328', email: 'ross@inspectingchicago.com', website: 'https://inspectingchicago.com' },
  { category: 'Inspector', firstName: 'Aric', company: 'Inspection Geeks', city: 'Chicago' },
  { category: 'Insurance (Healthcare)', firstName: 'Stephan', lastName: 'Guran', company: 'Spartan Insurance, LLC', city: 'Chicago', altPhone: '813-860-4481', email: 'stephanguran.ins@gmail.com' },
  { category: 'Insurance (Home/Auto)', firstName: 'John', lastName: 'Schroeder', company: 'Erie Insurance', city: 'Chicago', phone: '708-586-1500', email: 'john.a.schroder.rwba@statefarm.com' },
  { category: 'Interior Design', firstName: 'John', lastName: 'Wolf', company: 'Wolf Home Design', city: 'Chicago', phone: '312-266-8100', email: 'info@wolfhomedesign.com', website: 'https://www.wolfhomedesign.com' },
  { category: 'Iron/Steel', firstName: 'Valentine', city: 'Chicago', phone: '773-457-5950' },
  { category: 'Irrigation', company: 'Aquaman Irrigation', city: 'Chicago', phone: '773-824-6702' },
  { category: 'Kids Entertainment', firstName: 'Anna', lastName: 'Sass', company: 'RC Juggles', city: 'Chicago', phone: '630-392-0615', email: 'rcjuggle@gmail.com' },
  { category: 'Landscape Architect', firstName: 'Catie', lastName: 'Trudeau', company: 'The Outside Design Studio', city: 'Chicago', phone: '773-580-5452', email: 'catie@theoutsidestudio.com', website: 'https://www.theoutsidestudio.com' },
  { category: 'Landscaper', company: 'JR Landscapers', address: '3908 N Christiana Ave', city: 'Chicago', phone: '773-286-8008', email: 'info@jrlandscapingservice.com', website: 'https://www.jrlandscapingservice.com' },
  { category: 'Landscaper', firstName: 'Carlos', lastName: 'Medina', company: 'Medina Lawn Care', address: '3500 N. Spaulding Ave', city: 'Chicago', phone: '773-617-5538', email: 'carlos@medianlawncare.com', website: 'https://www.medianlawncare.com' },
  { category: 'Lender', firstName: 'Ben', lastName: 'Cohen', company: 'Guaranteed Rate', address: '3940 N Ravenswood', city: 'Chicago', phone: '312-339-5530', email: 'ben@rate.com' },
  { category: 'Lender', firstName: 'Brad', lastName: 'Boden', company: 'Market Movement', address: '425 W. North Ave', city: 'Chicago', phone: '773-983-5190', email: 'bboden@selectlendingservices.com' },
  { category: 'Lender (Construction/Rehab)', firstName: 'Ryan', lastName: 'Cotter', company: 'The Mortgage Corp', city: 'Chicago', phone: '312-607-1111', email: 'Ryan@TheMtgCorp.com' },
  { category: 'Locksmith', company: 'Amazing Lock Service', address: '3165 N Halsted', city: 'Chicago', phone: '773-935-8900', email: 'amazinglockservice@yahoo.com', website: 'https://www.amazinglockservice.com' },
  { category: 'Marble/Stone Work', firstName: 'Manuell', lastName: 'Botelo', city: 'Chicago', phone: '630-346-0271' },
  { category: 'Mason', firstName: 'Robert', city: 'Chicago', altPhone: '847-456-3808' },
  { category: 'Mindset Coach', firstName: 'Nadene', lastName: 'Cherry', city: 'Chicago', email: 'nadene@nadenecherry.com', website: 'https://nadenecherry.com' },
  { category: 'Movers', company: '1st Class Movers', address: '3060 Commercial Ave', city: 'Northbrook', phone: '800-704-0242', altPhone: '847-272-9988', email: 'rengelhart@1stclassmovers.com', website: 'https://1stclassmovers.com' },
  { category: 'Movers', company: 'Bernard Movers', address: '2520 S State St', city: 'Chicago', phone: '(773) 883-0780', website: 'https://www.bernardmovers.com' },
  { category: 'Painters', firstName: 'Alex', company: 'Blue Painting Plus', address: '26621 N. Pond Shore Dr.', city: 'Wauconda', phone: '847-338-5685' },
  { category: 'Painters', firstName: 'Dan', lastName: 'Poniatowski', company: 'P5 Painting', address: '1658 N. Milwaukee Ave', city: 'Chicago', phone: '773-307-8715', email: 'info@p5painting.com', website: 'https://www.p5painting.com' },
  { category: 'Painters', firstName: 'Chuck', city: 'Chicago', phone: '773-619-5524' },
  { category: 'Personal Chef', firstName: 'Chris', lastName: 'Curren', company: 'Fulton Market Chef', address: '311 N. Sangamon St.', city: 'Chicago', phone: '312-733-6900', altPhone: '312-622-0980', website: 'https://www.fultonmarketkitchen.com' },
  { category: 'Personal Organizer', firstName: 'Pamela', lastName: 'Sherman', company: 'Chicago Organized Home', address: '1512 N. Fremont St. #102', city: 'Chicago', phone: '872-356-6328', altPhone: '312-320-6789', website: 'https://www.chicagoorganizedhome.com' },
  { category: 'School Consultant', firstName: 'Grace Lee', lastName: 'Sawin', company: 'Chicago School GPS', city: 'Chicago', phone: '312-324-4774', email: 'info@chischoolgps.com', website: 'https://www.chischoolgps.com' },
  { category: 'Personal Stylist', firstName: 'Kim', lastName: 'Preis', city: 'Chicago', email: 'kim@kimpreisstyle.com', website: 'https://www.kimpreisstyle.com' },
  { category: 'Photographer', firstName: 'Vicki', lastName: 'Ochstein', city: 'Chicago', email: 'vicki@vbophoto.com' },
  { category: 'Power Washer', firstName: 'Doug', company: 'Pressure Washing Chicago', address: '1341 W. Fullerton Ave. Ste 139', city: 'Chicago', phone: '312-384-0044', email: 'doug@pressurewashingchicago.com', website: 'https://www.pressurewashingchicago.com' },
  { category: 'Private Aviation', firstName: 'Andrea', lastName: 'Chadwick', company: 'Andova Travel', city: 'Chicago' },
  { category: 'Roofer', firstName: 'Jesse', lastName: 'Schatz', company: 'CRC Roofing', address: '27820 N. Irma Lee Cir', city: 'Lake Forest', phone: '847-247-4400', altPhone: '847-514-5088', email: 'jschatz@cedarroofingcompany.com', website: 'https://www.cedarroofingcompany.com' },
  { category: 'Roofer', firstName: 'Mark', lastName: 'Boronski', company: 'E & G Construction', address: '840 E. Grant Dr.', city: 'Des Plaines', phone: '847-390-0087', altPhone: '847-494-6003', email: 'mboronski85@yahoo.com', website: 'https://www.eandgexteriorsinc.com' },
  { category: 'Security', firstName: 'Brian', lastName: 'Chadwick', company: 'Windsor', city: 'Chicago', phone: '312-316-4651' },
  { category: 'Security', company: 'Keyth Command', address: '1575 Oakwood Ave.', city: 'Highland Park', phone: '847-433-0000', website: 'https://www.keyth.com' },
  { category: 'Siding', firstName: 'Derek', company: 'A & D Siding and Construction', address: '115 E. Ogden Ave', city: 'Naperville', phone: '800-557-1398', altPhone: '312-371-0877', website: 'https://www.andexteriors.com' },
  { category: 'Travel Advisor', firstName: 'Lauren', lastName: 'Krist', company: 'Videre Travel', city: 'Chicago', phone: '847-757-5533', email: 'lauren@videretravel.com' },
  { category: 'Vintage Jewelry', firstName: 'Vicki', lastName: 'Ochstein', city: 'Chicago', phone: '917-648-1349', email: 'vicki@vbophoto.com' },
  { category: 'Wallpaper Installer', firstName: 'Conrad', city: 'Chicago', phone: '773-727-8865' },
  { category: 'Wallpaper Installer', firstName: 'Dan W.', lastName: 'Heseltine', company: "Dan's Painting and Decorating LLC", address: '9327 S. Spaulding Ave', city: 'Evergreen', phone: '815-723-9434' },
  { category: 'Waterproofer (Mason)', firstName: 'Miguel', lastName: 'Ines', company: 'Red Stone Construction', phone: '708-477-5899', email: 'redstoneconstructioninc1@gmail.com' },
  { category: 'Wealth Manager', firstName: 'Steve', lastName: 'Schwartz', company: 'Edward Jones', address: '5901 Dempster St. Ste 100', city: 'Morton Grove', phone: '847-965-6960', altPhone: '312-342-7200', website: 'https://www.edwardjones.com' },
  { category: 'Wealth Manager', firstName: 'Brent', lastName: 'Fields', company: 'Total Clarity Wealth Management, Inc.', address: '525 Tyler Road Ste. T', city: 'St. Charles', phone: '630-940-1424', email: 'brent@totalclaritywealth.com', website: 'https://www.totalclaritywealth.com' },
  { category: 'Window/Door', firstName: 'George', lastName: 'Dimitri', city: 'Chicago', phone: '847-902-3760', email: 'gdimitri@pella.com', website: 'https://www.pella.com' },
]
