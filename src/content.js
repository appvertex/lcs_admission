export const defaultContent = {
  schemaVersion: 2,
  schoolName: 'Loretto Central School',
  tagline: 'Love through service',
  topbarText: 'CBSE affiliated school',
  logoUrl: '/loretto-logo.png',
  navigation: { home: 'Home', about: 'About', facilities: 'Facilities', activities: 'Activities', gallery: 'Gallery', admissions: 'Admission overview', apply: 'Enquire for admission' },
  sections: { hero: true, facts: true, about: true, facilities: true, life: true, gallery: true, admissionsCta: true },
  hero: {
    badge: 'CBSE affiliated school', title: 'Learning rooted', highlight: 'in values.',
    body: 'Loretto Central School nurtures young minds through education rooted in values, discipline and innovation.',
    motto: 'Love through service', imageUrl: 'https://lorettocentralschool.edu.in/assets/school%20img-D_uBgOKP.webp',
    imageAlt: 'Loretto Central School campus', imageCaption: 'A place to learn and grow'
  },
  facts: [
    { title: '2010', label: 'Established' },
    { title: 'CBSE', label: 'Affiliated school' },
    { title: 'Every child', label: 'Known and encouraged' }
  ],
  about: {
    badge: 'About our school', title: 'A legacy of excellence', highlight: '& values.',
    body: 'We believe education is about more than what happens in a classroom. It is the confidence to explore, the discipline to keep learning and the kindness to grow together.'
  },
  facilities: [
    { title: 'A place to belong', body: 'A welcoming campus where every child is known, supported and encouraged to grow.' },
    { title: 'Learning for life', body: 'A thoughtful curriculum that builds strong foundations, curiosity and confidence.' },
    { title: 'Beyond the classroom', body: 'Space for sport, creative expression, clubs and the everyday joy of learning together.' },
    { title: 'Care at every step', body: 'A caring school community that values character, kindness and each learner’s potential.' }
  ],
  facilitiesSection: { badge: 'THE LORETTO EXPERIENCE', title: 'Room to learn.', highlight: 'Space to flourish.', description: 'Strong foundations, caring relationships and experiences that help every child find their potential.', curriculumTitle: 'Curriculum & syllabus' },
  curriculumNote: 'Our curriculum supports strong foundations, curiosity and confidence. Ask the admissions team for the current class-wise syllabus.',
  life: {
    badge: 'Life at Loretto', title: 'Learning happens', highlight: 'in many ways.',
    body: 'From classroom discovery to shared activities, school life gives children more ways to explore their interests and grow with confidence.',
    imageUrl: 'https://res.cloudinary.com/dtlgn2pdf/image/upload/f_auto,q_auto,w_1000/v1774673958/loretto/images/6628beb4-30b4-4b7a-96ca-975018c17ca0.jpg',
    imageAlt: 'School life at Loretto Central School', imageCaption: 'Learn · Grow · Belong',
    activities: ['Sports & movement', 'Music & performance', 'Creative arts', 'Clubs & community']
  },
  gallery: {
    badge: 'School gallery', title: 'Life at Loretto Central School',
    description: 'A glimpse of our campus and school community',
    images: [
      { url: 'https://res.cloudinary.com/dtlgn2pdf/image/upload/f_auto,q_auto,w_1000/v1774673969/loretto/images/7e0162ed-f777-4840-a85d-b611c025be15.jpg', alt: 'Loretto Central School gallery photo 1' },
      { url: 'https://res.cloudinary.com/dtlgn2pdf/image/upload/f_auto,q_auto,w_1000/v1774673981/loretto/images/d3cdb79c-e8ea-4439-8b91-062cb3a1f37e.jpg', alt: 'Loretto Central School gallery photo 2' },
      { url: 'https://res.cloudinary.com/dtlgn2pdf/image/upload/f_auto,q_auto,w_1000/v1774674002/loretto/images/a6cb0480-2acf-4f43-a977-a11e6e90990f.jpg', alt: 'Loretto Central School gallery photo 3' },
      { url: 'https://res.cloudinary.com/dtlgn2pdf/image/upload/f_auto,q_auto,w_1000/v1774674021/loretto/images/17827bf2-7167-4c69-965b-333d7c5fab2d.jpg', alt: 'Loretto Central School gallery photo 4' }
    ]
  },
  admissionsCta: {
    badge: 'Admissions', title: 'Every great journey', highlight: 'starts with a hello.',
    body: 'Tell us about your child. Our admissions team will help you with the next steps.'
  },
  promo: {
    enabled: true, headline: 'Give them room to become.',
    body: 'Admissions are open. Discover a school community where learning goes further and every child can find their way.',
    imageUrl: '', imageCaption: 'A bright beginning starts here.', note: 'A few details are all it takes to get started.'
  },
  overview: {
    badge: 'Join our community', title: 'Admission', highlight: 'overview.',
    intro: 'Everything you need to know to take the first step towards Loretto Central School.',
    sectionBadge: 'Admissions / how it works', sectionTitle: 'A clear path,', sectionHighlight: 'from the start.',
    steps: [
      { title: 'Send an enquiry', body: 'Tell us a little about your child and the class you are interested in. Our admissions team will get in touch.' },
      { title: 'Talk with our team', body: 'We will help you understand availability, the school day and the documents needed for your application.' },
      { title: 'Meet the school', body: 'Arrange a visit and learn more about the campus, our approach and the Loretto community.' },
      { title: 'Complete your application', body: 'If a place is available, our team will guide you through the formal application and next steps.' }
    ],
    policyBadge: 'A note for families', policyTitle: 'Here to help you', policyHighlight: 'find your way.',
    policyText: 'Admission is subject to class availability and the school’s age and eligibility criteria. Please contact the admissions office for the current prospectus, fee schedule, required documents and dates.\n\nSubmitting an enquiry is not an admission application or confirmation of a place. Our team will contact you to explain the process for your child’s class.'
  },
  footer: { admissionsText: 'Admissions enquiries', copyright: '© Loretto Central School' }
};

export function mergeContent(saved) {
  if (!saved || saved.schemaVersion !== defaultContent.schemaVersion) return defaultContent;
  const merge = (base, value) => {
    if (Array.isArray(base)) return Array.isArray(value) ? value : base;
    if (base && typeof base === 'object') {
      return Object.fromEntries(Object.entries(base).map(([key, item]) => [key, merge(item, value?.[key])]));
    }
    return typeof value === typeof base ? value : base;
  };
  return merge(defaultContent, saved);
}
